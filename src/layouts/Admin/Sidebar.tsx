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
import { useNavigate } from "react-router-dom"
import clsx from "clsx"

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
  getItem(
    "Dashboard",
    "/admin/dashboard",
    <AppstoreOutlined className={iconStyle} />
  ),
  getItem("Khoá học", "/admin/courses", <BookOutlined className={iconStyle} />),
  getItem(
    "Học viên",
    "/admin/students",
    <TeamOutlined className={iconStyle} />
  ),
  getItem(
    "Giảng viên",
    "/admin/instructors",
    <UserOutlined className={iconStyle} />
  ),
  getItem(
    "Báo cáo",
    "/admin/reports",
    <BarChartOutlined className={iconStyle} />
  ),
  getItem(
    "Content",
    "/admin/content",
    <FileTextOutlined className={iconStyle} />
  ),
  getItem(
    "Cài đặt",
    "/admin/settings",
    <SettingOutlined className={iconStyle} />
  ),
]

interface SidebarProps {
  collapsed: boolean
}

function Sidebar({ collapsed }: SidebarProps) {
  const [currentSelectedKey, setCurrentSelectedKey] =
    useState<string>("dashboard")
  const navigate = useNavigate()
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(`${e.keyPath}`)
  }

  return (
    <Sider
      width={350}
      className="!bg-slate-50 border-r border-gray-200 h-screen fixed left-0 top-0 pt-[20px] z-40 overflow-hidden"
      theme="light"
      collapsed={collapsed}>
      <Avatar
        icon={<UserOutlined />}
        className={clsx(
          "bg-gray-200 text-gray-700 transition-all duration-300",
          !collapsed ? "!ml-[30px]" : "!-ml-[350px]"
        )}
        size={60}
      />
      <Menu
        onClick={handleMenuClick}
        selectedKeys={[currentSelectedKey]}
        mode="inline"
        items={items}
        className="!border-r-0 !bg-slate-50 !text-[18px]"
        style={{
          overflowY: "auto",
        }}
      />
    </Sider>
  )
}

export default Sidebar
