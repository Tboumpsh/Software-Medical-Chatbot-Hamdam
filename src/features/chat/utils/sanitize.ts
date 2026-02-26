// =====================================================================
//  Hamdam – Safe Markdown Renderer
//  Prevents XSS while rendering assistant messages
// =====================================================================

/**
 * Very lightweight markdown → safe HTML converter.
 * Avoids importing DOMPurify on the server side.
 * Full client-side sanitization is applied in MessageBubble via DOMPurify.
 */
export function markdownToSafeHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML special characters first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Code inline
  html = html.replace(/`(.+?)`/g, '<code class="inline-code">$1</code>');

  // Unordered list
  html = html.replace(
    /^([•\-\*])\s+(.+)$/gm,
    '<li class="list-item">$2</li>',
  );
  html = html.replace(/(<li.*<\/li>)+/gs, '<ul class="list">$&</ul>');

  // Ordered list
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="list-item">$1</li>');

  // Headers
  html = html.replace(/^#{3}\s+(.+)$/gm, '<h3 class="heading-3">$1</h3>');
  html = html.replace(/^#{2}\s+(.+)$/gm, '<h2 class="heading-2">$1</h2>');
  html = html.replace(/^#{1}\s+(.+)$/gm, '<h2 class="heading-2">$1</h2>');

  // Paragraphs – convert double newlines
  html = html.replace(/\n\n+/g, '</p><p class="paragraph">');
  html = `<p class="paragraph">${html}</p>`;

  // Single newlines → <br>
  html = html.replace(/\n/g, '<br>');

  // Cleanup empty paragraphs
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '');

  return html;
}

/**
 * Strip all HTML from a string (plain text output)
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
