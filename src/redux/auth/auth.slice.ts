import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ACCESS_TOKEN, USER_CURRENT } from "../../shared/constants/auth"
import type { LoginResponse, User } from "../../shared/types/auth"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  accessToken: string | null
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem(USER_CURRENT) as string) || null,
  accessToken: localStorage.getItem(ACCESS_TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(USER_CURRENT),
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<LoginResponse>) => {
      const { accessToken, user } = action.payload
      localStorage.setItem(USER_CURRENT, JSON.stringify(user))
      localStorage.setItem(ACCESS_TOKEN, accessToken)
      state.user = user
      state.accessToken = accessToken
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      localStorage.removeItem(USER_CURRENT)
      localStorage.removeItem(ACCESS_TOKEN)
      window.location.href = "/login"
    },
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer
