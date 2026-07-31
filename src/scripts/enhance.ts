/**
 * Site-wide motion. Everything in here is decoration: the page is complete,
 * readable and navigable before this file runs, and stays that way if it never
 * does. Nothing here carries meaning that isn't also in the markup.
 *
 * Three rules this file holds to:
 *   1. Only `opacity` and `transform` are animated, so the compositor can do
 *      the work without a layout or paint pass on any frame.
 *   2. Anything that can be expressed as a scroll-driven CSS animation is —
 *      the reading progress bar and the header parallax both live in
 *      global.css and never touch this file. See the `@supports
 *      (animation-timeline: view())` block there.
 *   3. `prefers-reduced-motion` removes movement rather than shortening it.
 *
 * What is left here is the two things CSS genuinely cannot do: reveal an
 * element the first time it is scrolled to, and tell the header whether the
 * page has moved beneath it.
 *
 * Astro's ClientRouter swaps documents without reloading, so this module is
 * evaluated once and re-initialises per page via `astro:page-load`.
 */

type Cleanup = () => void;

/** Torn down and rebuilt on every navigation — the elements they observe are
 *  discarded by the router's swap. */
let cleanups: Cleanup[] = [];
let hasInitialised = false;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function teardown() {
  for (const cleanup of cleanups) cleanup();
  cleanups = [];
}

/* ── Scroll reveal ──────────────────────────────────────────────────────────
   Content rises into place as it is scrolled to. Anything already on screen
   when the page arrives reveals immediately on its own stagger — a first
   screen must never wait for a scroll that may never come. */
function setupReveal() {
  const items = Array.from(
    document.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-rule, .reveal-media, .reveal-words'
    )
  );
  if (!items.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    for (const el of items) el.classList.add('is-visible');
    return;
  }

  const show = (el: HTMLElement) => {
    const delay = Number(el.dataset.revealDelay ?? 0);
    if (delay > 0) window.setTimeout(() => el.classList.add('is-visible'), delay);
    else el.classList.add('is-visible');
  };

  let pending = items.filter((el) => {
    if (el.getBoundingClientRect().top >= window.innerHeight) return true;
    show(el);
    return false;
  });
  if (!pending.length) return;

  // The bottom 10% of the viewport is excluded so an element animates as it is
  // scrolled properly into view rather than the instant its top edge clips the
  // fold. Threshold stays at 0: with a dead zone already in place, also
  // demanding a proportion of the element be inside it strands anything tall
  // enough that 5% of it never fits.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0 }
  );
  for (const el of pending) observer.observe(el);
  cleanups.push(() => observer.disconnect());

  // The first-screen pass above runs before the display face has necessarily
  // swapped in, and a font swap re-flows every heading on the page. Re-checking
  // once fonts settle is what stops a block that ends up just above the fold
  // from waiting for a scroll that may never come.
  document.fonts?.ready.then(() => {
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top >= window.innerHeight) return true;
      observer.unobserve(el);
      show(el);
      return false;
    });
  });
}

/* ── Header ─────────────────────────────────────────────────────────────────
   The header is fixed on every page. Over the landing hero it starts
   transparent and earns its blurred ground once the page has moved beneath
   it; everywhere else that state is on from the first pixel of scroll. */
function setupHeader() {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  let frame = 0;
  const update = () => {
    frame = 0;
    header.toggleAttribute('data-scrolled', window.scrollY > 24);
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll);
    if (frame) cancelAnimationFrame(frame);
  });

  // Publish the header's measured height so anything that has to dock directly
  // beneath it — the papers filter bar, anchored scroll offsets — lands exactly
  // on its edge instead of on a number guessed from the type scale. The header
  // does not change height on scroll, so this only re-runs on resize.
  const publishHeight = () =>
    document.documentElement.style.setProperty(
      '--spacing-header',
      `${Math.round(header.getBoundingClientRect().height)}px`
    );
  publishHeight();
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(publishHeight);
    observer.observe(header);
    cleanups.push(() => observer.disconnect());
  }
}

function init() {
  hasInitialised = true;
  teardown();
  setupReveal();
  setupHeader();
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', teardown);

// Safety net. `astro:page-load` is the router's signal and fires on a cold load
// too — but if the router itself fails to arrive, reveal elements would sit at
// opacity 0 forever. Nothing on this site is worth a blank page.
window.setTimeout(() => {
  if (!hasInitialised) init();
}, 1500);
