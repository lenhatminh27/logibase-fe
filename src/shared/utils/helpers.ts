import type { AxiosError } from "axios"
import type { ErrorResponse } from "../types/response"

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

export const convertDurationFromSeconds = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  const parts = []
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}p`)
  if (s > 0 || parts.length === 0) parts.push(`${s}s`)

  return parts.join(" ")
}

export const getErrorMessage = (error: AxiosError): string => {
  const errorData: ErrorResponse = (error as AxiosError).response
    ?.data as ErrorResponse
  return errorData.message
}
