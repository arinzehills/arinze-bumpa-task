import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@modules/auth/stores/useAuthStore'
import { Icon } from '@iconify/react'

export interface SidebarLink {
  name: string
  url: string
  icon: string
}

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
  sidebarLinks: SidebarLink[]
  isAdmin?: boolean
  isMobile?: boolean
}

export const DashboardSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sidebarLinks = [],
  isAdmin = false,
  isMobile = false,
}) => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [expanded, setExpanded] = useState(!isMobile)

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    logout()
    navigate(isAdmin ? '/admin-login' : '/login')
  }

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      <div
        className={`fixed sm:relative sm:h-screen top-0 left-0 h-full bg-bg-secondary shadow-lg z-50 border-r border-border-color transition-all duration-300 ease-in-out ${
          expanded ? 'lg:w-64 sm:w-64' : 'w-20'
        } ${isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-color">
          <div
            className={`flex items-center space-x-2 ${
              expanded ? 'block' : 'hidden'
            }`}
          >
            <div className="h-8 w-8 rounded bg-brand-primary flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="text-lg font-semibold text-text-primary">
              Loyalty
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md text-text-muted hover:bg-bg-elevated transition-colors"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            <Icon
              icon={expanded ? 'ph:caret-left' : 'ph:caret-right'}
              className="text-xl"
            />
          </button>
        </div>

        {/* Sidebar body */}
        <div className="flex flex-col h-[calc(100%-64px)]">
          {/* Scrollable nav section */}
          <div
            className={`flex-1 overflow-y-auto ${expanded ? 'px-4' : 'px-2'}`}
          >
            <div className="py-4">
              <ul className="space-y-2">
                {sidebarLinks?.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.url}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `flex items-center p-3 font-medium gap-x-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-brand-primary text-white'
                            : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary'
                        }`
                      }
                    >
                      <Icon icon={item.icon} className="text-lg flex-shrink-0" />
                      {expanded && (
                        <span className="text-sm duration-300 origin-left">
                          {item.name}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fixed Logout section at bottom */}
          <div className="pb-4 border-t border-border-color pt-4 px-2">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 p-3 text-text-muted hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 ${
                expanded ? '' : 'justify-center'
              }`}
            >
              <Icon icon="ph:sign-out" className="text-lg flex-shrink-0" />
              {expanded && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}