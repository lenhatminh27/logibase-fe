export type Role = "ADMIN" | "USER"

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  address: string
  phoneNumber: string
}

export interface LoginRequest {
  email: string
  password: string
}
export interface User {
  email: string
  role: Role
  fullName: string
}
export interface LoginResponse {
  accessToken: string
  user: User
}

export interface RegisterResponse {}
