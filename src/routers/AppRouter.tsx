import { Route, Routes } from "react-router-dom"
import { authRoutes, privateRoutes, publicRoutes } from "./routes"
import AuthRoute from "./AuthRoute"
import PrivateRoute from "./PrivateRoute"
import Layout from "../layouts/Customer/Layout"

function AppRouter() {
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
        {privateRoutes.map((route) => (
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
    </Routes>
  )
}

export default AppRouter
