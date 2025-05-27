import { Navigate, Route, Routes } from "react-router-dom"
import { adminRoutes, authRoutes, privateRoutes, publicRoutes } from "./routes"
import AuthRoute from "./AuthRoute"
import PrivateRoute from "./PrivateRoute"
import Layout from "../layouts/Customer/Layout"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import AdminLayout from "../layouts/Admin/AdminLayout"
import type { User } from "../shared/types/auth"
import NotFoundPage from "../pages/404"

function AppRouter() {
  const user: User | null = useSelector((state: RootState) => state.auth.user)

  if (user && user?.role === "ADMIN")
    return (
      <Routes>
        <Route path="/" element={<Navigate to={"/admin/courses"} replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    )
  else
    return (
      <Routes>
        <Route element={<Layout />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          {user &&
            privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PrivateRoute>
                    <route.component />
                  </PrivateRoute>
                }
              />
            ))}
        </Route>
        {authRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AuthRoute>
                <route.component />
              </AuthRoute>
            }
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    )
}

export default AppRouter
