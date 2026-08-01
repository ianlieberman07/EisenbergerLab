import { escapeHtml } from './emphasis';

/**
 * Wraps each word of a heading so it can rise into place behind a mask.
 *
 * The wrappers are markup only — the text itself is untouched, and the words
 * are joined by real whitespace text nodes rather than margins, so the heading
 * still wraps, balances, reads aloud and copies exactly as it did before.
 *
 * `--i` is the word's index; `.split-word` in global.css turns it into the
 * stagger. See `html.js .reveal-words` there for the animation.
 *
 * Input is the lab's own copy, never user input, but it is escaped anyway so
 * this is safe to hand to `set:html`.
 */
export function splitWords(input: string): string {
  return input
    .trim()
    .split(/\s+/)
    .map(
      (word, i) =>
        `<span class="split-word" style="--i:${i}"><span>${escapeHtml(word)}</span></span>`
    )
    .join(' ');
}
