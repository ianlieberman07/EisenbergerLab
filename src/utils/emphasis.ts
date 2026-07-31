/**
 * Converts the `*emphasis*` in a frontmatter string into real `<em>` markup.
 *
 * Her copy leans on italics to carry meaning — "*hurt* feelings", "*prepared
 * fear suppressors*", the "*social*" in "specifically *social* consequences" —
 * and CLAUDE.md §3 requires that emphasis be preserved. Summaries live in
 * frontmatter, which is a plain string rather than rendered markdown, so
 * without this the asterisks would print literally.
 *
 * Input is the client's own content, not user input, but the text is escaped
 * before any markup is added so this stays safe to pass to `set:html`.
 */
const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (c) => ESCAPES[c]!);
}

export function emphasize(input: string): string {
  return escapeHtml(input).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
