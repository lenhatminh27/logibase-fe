import Header from "./Header"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useState } from "react"

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex w-full h-screen">
      <Sidebar collapsed={collapsed} />
      <div className="flex flex-col w-full overflow-hidden">
        <Header
          collapsed={collapsed}
          handleCollapsed={() => setCollapsed(!collapsed)}
        />
        <div className="container flex-1 overflow-y-auto scrollbar-hide">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
