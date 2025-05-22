import type { LessonResponse } from "./lesson"

export interface SectionResponse {
  id: number
  title: string
  target: string
  orderIndex: number
  createdAt: Date
  updatedAt: Date
  courseLessons: LessonResponse[]
}

export interface CreateSectionRequest {
  courseId: number
  title: string
  target: string
  orderIndex: number
}
