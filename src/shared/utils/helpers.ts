export function shorteningContent(content: string, maxLength = 70): string {
  if (!content) return ""
  return content.length > maxLength
    ? content.slice(0, maxLength).trimEnd() + "..."
    : content
}
