import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"

function Layout() {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout
