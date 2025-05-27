import type { UserResponse } from "./user"

export interface CommentResponse {
  id: number
  lessonId: number
  content: string
  user: UserResponse
  createdAt: Date
  updatedAt: Date | null
  childrenComments: CommentResponse[]
}
