export interface LessonResponse {
  id: number
  sectionId: number
  title: string
  description: string
  videoUrl: string
  article: string
  duration: number
  orderIndex: number
  createdAt: Date
  updatedAt: Date
  done: boolean
  trial: boolean
}

export interface CreateLessonRequest {
  sectionId: number
  title: string
  description: string
  videoUrl: string | null
  article: string | null
  duration: number
}
