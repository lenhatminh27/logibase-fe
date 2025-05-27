import { Layout, Input, Dropdown, Menu, Avatar, Typography, Button } from "antd"
import {
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons"
import Logo from "../../components/Logo"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../redux/auth/auth.slice"
import type { RootState } from "../../redux/store"

interface HeaderProps {
  collapsed: boolean
  handleCollapsed: () => void
}
function Header({ collapsed, handleCollapsed }: HeaderProps) {
  const dispatch = useDispatch()
  const onLogout = () => {
    dispatch(logout())
  }
  const user = useSelector((state: RootState) => state.auth.user)
  const menu = (
    <Menu
      items={[
        {
          key: "profile",
          icon: <UserOutlined />,
          label: "My Profile",
        },
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: "Settings",
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Logout",
          onClick: onLogout,
          danger: true,
        },
      ]}
    />
  )

  return (
    <Layout.Header className="!bg-white !px-6 !py-0 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleCollapsed}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />

        <Logo />
      </div>
      <div className="flex-grow max-w-md mx-4">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search..."
          className="rounded-md"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
          <a
            onClick={(e) => e.preventDefault()}
            className="flex items-center cursor-pointer">
            <Avatar
              icon={<>{<>{user?.fullName.split(" ")[1].charAt(0)}</>}</>}
              className="bg-gray-200 text-gray-700"
              size={50}
            />
            <p className="ml-3 font-semibold text-2xl">{user?.fullName}</p>
          </a>
        </Dropdown>
      </div>
    </Layout.Header>
  )
}

export default Header
