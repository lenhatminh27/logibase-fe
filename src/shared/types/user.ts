export interface UserResponse {
  id: number
  email: string
  role: string
  fullName: string
}

export interface CreateUserRequest {
  email: string
  password: string
  role: "ADMIN" | "USER"
  firstName: string
  lastName: string
}
