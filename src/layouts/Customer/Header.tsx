import React, { useState } from "react"
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa"
import { UserOutlined } from "@ant-design/icons"
import Logo from "../../components/Logo"
import { Avatar, Button, Divider } from "antd"
import { Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { logout } from "../../redux/auth/auth.slice"
interface SubNavItem {
  href: string
  label: string
}
interface NavItemProps {
  href: string
  label: string
  isActive?: boolean
  subItems?: SubNavItem[]
}

interface MobileNavItemProps extends NavItemProps {
  onClick?: () => void
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  label,
  isActive,
  subItems,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const hasSubItems = subItems && subItems.length > 0

  return (
    <div
      className="relative h-full"
      onMouseEnter={() => hasSubItems && setIsDropdownOpen(true)}
      onMouseLeave={() => hasSubItems && setIsDropdownOpen(false)}>
      <a
        href={href}
        className={`
          flex items-center h-full px-3 lg:px-4 
          text-sm font-medium uppercase tracking-wider
          border-b-[3px] transition-all duration-200 ease-in-out
          cursor-pointer {/* Indicate it's clickable/hoverable */}
          ${
            isActive || (isDropdownOpen && hasSubItems)
              ? "text-yellow-400 border-yellow-400"
              : "text-white border-transparent hover:text-yellow-300 hover:border-yellow-300"
          }
        `}>
        {label}
      </a>
      {isDropdownOpen && hasSubItems && (
        <ul
          className="absolute top-full left-0 mt-0 w-auto min-w-[240px] 
                     bg-white shadow-lg rounded-b-md py-1.5 z-50">
          {subItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap transition-colors duration-150">
                {item.label}{" "}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({
  href,
  label,
  isActive,
  onClick,
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`
        block px-3 py-3 rounded-md text-base font-medium uppercase
        transition-colors duration-150 ease-in-out
        ${
          isActive
            ? "bg-yellow-500 text-black"
            : "text-gray-200 hover:bg-gray-700 hover:text-white"
        }
      `}>
      {label}
    </a>
  )
}

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { pathname } = useLocation()
  const isActiveHeaderItem = (path: string): boolean => {
    return "/" + pathname.split("/")[1] === path
  }

  let navLinks: NavItemProps[] = [
    { href: "/", label: "HOME" },

    {
      href: "/courses",
      label: "KHÓA HỌC",
    },
  ]
  if (user) {
    navLinks = navLinks.concat([
      {
        href: "/learn",
        label: "Khoá học của tôi",
      },
    ])
  }

  return (
    <header className="shadow-lg bg-white">
      <div className="bg-[#1E232C] text-gray-300 text-xs">
        <div className="container mx-auto flex flex-wrap justify-between items-center py-2 px-4">
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-5 py-1">
            <div className="flex items-center space-x-1.5">
              <FaPhoneAlt size={12} />
              <span>0123456789</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <FaMapMarkerAlt size={12} />
              <span>Trường ĐH FPT, xã Thạch Hòa, huyện Thạch Thất, Hà Nội</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <FaClock size={12} />
              <span>Thứ 2 - Thứ 6, Chủ Nhật: 9:00 - 21:00</span>
            </div>
          </div>
          {!user ? (
            <div className="flex">
              <Link
                to="/login"
                className="hover:text-white flex items-center text-[18px]">
                <FaUser size={20} className="mr-5" />
                Đăng nhập
              </Link>
              <Divider type="vertical" className="!text-white !h-8 bg-white" />
              <Link
                to="/register"
                className="hover:text-white flex items-center text-[18px]">
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="flex items-center">
              <Avatar
                icon={<UserOutlined />}
                className="bg-gray-200 text-gray-700 transition-all duration-300"
                size={50}
              />
              <p className="!text-[18px] mx-3">{user.fullName}</p>
              <Divider type="vertical" className="!text-white !h-8 bg-white" />
              <Button
                color="primary"
                variant="link"
                className="!bg-transparent outline-0 !text-white !text-[18px] hover:!text-gray-500 !mb-0.5"
                onClick={() => dispatch(logout())}>
                Đăng xuất
              </Button>
            </div>
          )}
        </div>
      </div>
      <nav className="bg-[#2D333E] text-white">
        <div className="container mx-auto flex justify-between items-stretch h-16 md:h-[70px] px-4">
          <Logo />
          <div className="hidden md:flex items-center space-x-0 lg:space-x-1">
            {navLinks.map((link) => (
              <NavItem
                key={link.label}
                href={link.href}
                label={link.label}
                isActive={isActiveHeaderItem(link.href)}
                subItems={link.subItems}
              />
            ))}
          </div>
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="md:hidden">
              <button
                aria-label="Toggle menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                {isMobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#2D333E] border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => {
                return (
                  <MobileNavItem
                    key={link.label}
                    href={link.href}
                    label={link.label}
                    isActive={link.isActive}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
