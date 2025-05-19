import type { JSX } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { Navigate } from "react-router-dom"

interface AuthRouteProps {
  children: JSX.Element
}

function AuthRoute({ children }: AuthRouteProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  return <>{isAuthenticated ? <Navigate to={"/"} /> : <>{children}</>}</>
}

export default AuthRoute
