import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DashboardSidebar, type SidebarLink } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'

export type { SidebarLink }

interface DashboardLayoutProps {
  sidebarLinks: SidebarLink[]
  isAdmin?: boolean
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebarLinks,
  isAdmin = false,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="h-screen bg-bg-primary w-screen flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        sidebarLinks={sidebarLinks}
        isAdmin={isAdmin}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader onMenuClick={toggleSidebar} isAdmin={isAdmin} />

        <main className="flex-1 p-4 lg:p-6 bg-bg-primary h-screen overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
