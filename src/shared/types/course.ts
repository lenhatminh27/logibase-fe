export interface CourseResponse {
  id: number
  title: string
  description: string
  thumbnail: string
  price: number
  status: "PUBLIC" | "DRAFT"
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
