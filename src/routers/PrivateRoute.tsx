import type { JSX } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { Navigate } from "react-router-dom"

interface PrivateRouteProps {
  children: JSX.Element
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const user = useSelector((state: RootState) => state.auth.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "USER") return <Navigate to="/403" replace />
  return <>{children}</>
}

export default PrivateRoute
