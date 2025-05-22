export function shorteningContent(content: string, maxLength = 70): string {
  if (!content) return ""
  return content.length > maxLength
    ? content.slice(0, maxLength).trimEnd() + "..."
    : content
}

export const convertDurationStringFromSeconds = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}
