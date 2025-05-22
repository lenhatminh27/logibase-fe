import { lazy } from "react"
import type { Route } from "../shared/types/route"

export const publicRoutes: Route[] = [
  {
    path: "/",
    component: lazy(() => import("../pages/Customer/HomePage/HomePage")),
  },
  {
    path: "/courses",
    component: lazy(() => import("../pages/Customer/CoursePage/CoursePage")),
  },
]

export const privateRoutes: Route[] = []

export const authRoutes: Route[] = [
  {
    path: "/login",
    component: lazy(() => import("../pages/Customer/LoginPage/LoginPage")),
  },
  {
    path: "/register",
    component: lazy(
      () => import("../pages/Customer/RegisterPage/RegisterPage")
    ),
  },
  {
    path: "/forgot-password",
    component: lazy(
      () => import("../pages/Customer/ForgotPasswordPage/ForgotPasswordPage")
    ),
  },
]

export const adminRoutes: Route[] = [
  {
    path: "/admin",
    component: lazy(() => import("../pages/Admin/Dashboard/Dashboard")),
  },
  {
    path: "/admin/courses",
    component: lazy(() => import("../pages/Admin/CousePage/CourseList")),
  },
  {
    path: "/admin/courses/:id",
    component: lazy(
      () => import("../pages/Admin/CourseDetailPage/CourseDetailPage")
    ),
  },
  {
    path: "/admin/courses/:id/students",
    component: lazy(
      () => import("../pages/Admin/CourseStudentPage/CourseStudentPage")
    ),
  },
]
