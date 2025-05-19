import type { JSX } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { Navigate } from "react-router-dom"

interface PrivateRouteProps {
  children: JSX.Element
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = !!useSelector((state: RootState) => state.auth)
  return <>{children}</>
}

export default PrivateRoute
