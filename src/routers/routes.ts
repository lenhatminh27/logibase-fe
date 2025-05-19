import { lazy } from "react"
import type { Route } from "../shared/types/route"

export const publicRoutes: Route[] = [
  {
    path: "/",
    component: lazy(() => import("../pages/HomePage/HomePage")),
  },
]

export const privateRoutes: Route[] = []

export const authRoutes: Route[] = [
  {
    path: "/login",
    component: lazy(() => import("../pages/LoginPage/LoginPage")),
  },
  {
    path: "/register",
    component: lazy(() => import("../pages/RegisterPage/RegisterPage")),
  },
]
