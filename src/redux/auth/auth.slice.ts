import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
  user: any
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: () => {},
    logout: () => {},
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer
