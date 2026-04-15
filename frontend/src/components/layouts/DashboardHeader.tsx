import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Icon } from "@iconify/react";
import { useAdminAuthStore } from "@app/stores/useAdminAuthStore";
import { useAuthStore } from "@app/stores/useAuthStore";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  isAdmin?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuClick,
  isAdmin = false,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { logout: adminLogout } = useAdminAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    isAdmin ? adminLogout() : logout();
    navigate(isAdmin ? "/admin-login" : "/login");
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-bg-secondary border-b border-border-color p-4">
      <div className="flex items-center justify-between">
        {/* Menu button + title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-bg-elevated transition-colors lg:hidden"
            title="Toggle sidebar"
          >
            <Icon icon="ph:list" className="text-xl text-text-primary" />
          </button>

          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {isAdmin ? "Admin Dashboard" : "Dashboard"}
            </h1>
            <p className="text-xs text-text-muted hidden sm:block">
              Welcome back, {user?.name || "User"}
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-text-primary">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-text-muted">{user?.email}</p>
              </div>
              <Icon
                icon="ph:caret-down"
                className={`text-lg text-text-muted transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-bg-secondary border border-border-color rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-border-color">
                    <p className="text-sm font-medium text-text-primary">
                      {user?.name}
                    </p>
                    <p className="text-xs text-text-muted">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => navigate("/")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-bg-elevated transition-colors"
                  >
                    <Icon icon="ph:house" className="text-lg" />
                    <span>Home</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-border-color"
                  >
                    <Icon icon="ph:sign-out" className="text-lg" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
