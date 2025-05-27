import React, { useState } from "react"
import { Avatar, Layout, Menu } from "antd"
import {
  AppstoreOutlined, // Dashboard
  BookOutlined, // Courses
  TeamOutlined, // Students (more like a group)
  UserOutlined, // Instructors (could also use SolutionOutlined)
  BarChartOutlined, // Reports
  FileTextOutlined, // Content
  SettingOutlined, // Settings
} from "@ant-design/icons"
import type { MenuProps } from "antd"
import { useLocation, useNavigate } from "react-router-dom"
import clsx from "clsx"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"

const { Sider } = Layout

type MenuItem = Required<MenuProps>["items"][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const iconStyle = "!text-[25px]"

const items: MenuItem[] = [
  getItem("Khoá học", "/admin/courses", <BookOutlined className={iconStyle} />),
  getItem("Người dùng", "/admin/users", <TeamOutlined className={iconStyle} />),
  // getItem(
  //   "Giảng viên",
  //   "/admin/instructors",
  //   <UserOutlined className={iconStyle} />
  // ),

  // getItem(
  //   "Content",
  //   "/admin/content",
  //   <FileTextOutlined className={iconStyle} />
  // ),
  // getItem(
  //   "Cài đặt",
  //   "/admin/settings",
  //   <SettingOutlined className={iconStyle} />
  // ),
]

interface SidebarProps {
  collapsed: boolean
}

function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isActive = (path: string) => {
    return pathname === path
  }

  const user = useSelector((state: RootState) => state.auth.user)

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(`${e.keyPath}`)
  }

  return (
    <Sider
      width={350}
      className="!bg-slate-50 border-r border-gray-200 h-screen fixed left-0 top-0 pt-[20px] z-40 overflow-hidden"
      theme="light"
      collapsed={collapsed}>
      <div className="flex items-center">
        <Avatar
          icon={<>{user?.fullName.split(" ")[1].charAt(0)}</>}
          className={clsx(
            "bg-gray-200 text-gray-700 transition-all duration-300",
            !collapsed ? "!ml-[30px]" : "!-ml-[350px]"
          )}
          size={60}
        />
        <p className="ml-3 font-semibold text-2xl">{user?.fullName}</p>
      </div>
      <Menu
        onClick={handleMenuClick}
        selectedKeys={[pathname]}
        mode="inline"
        items={items}
        className={clsx("!border-r-0 !bg-slate-50 !text-[18px]")}
        style={{
          overflowY: "auto",
        }}
      />
    </Sider>
  )
}

export default Sidebar
