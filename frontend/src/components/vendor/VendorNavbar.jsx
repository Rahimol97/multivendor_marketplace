import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useVendorTheme } from "../context/VendorThemeContext";

import {
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ViewColumnsIcon,
  ChevronLeftIcon,
  RectangleGroupIcon,
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/outline";

function VendorNavbar({ collapsed, setCollapsed, setMobileOpen }) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useVendorTheme();

  if (loading) return null;

  const handlelogout = async () => {
    await api.post("/users/logout");
    setUser(null);
    navigate("/vendor/authvendor");
  };

  return (
    <header className="w-full min-w-0 bg-(--secondary) text-(--text) border-b border-b-slate-200">

      <div className="px-4 md:px-6 py-7 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          {/* Mobile Sidebar */}
          <button
            className="md:hidden text-(--accent)"
            onClick={() => setMobileOpen(true)}
          >
            <RectangleGroupIcon className="w-7 h-7" />
          </button>

          {/* Desktop Sidebar */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block text-(--accent)"
          >
            {collapsed ? (
              <ViewColumnsIcon className="w-7 h-7" />
            ) : (
              <ChevronLeftIcon className="w-7 h-7" />
            )}
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* THEME TOGGLE (VISIBLE MOBILE + DESKTOP) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-(--accent)" />
            )}
          </button>

          {/* DESKTOP PROFILE */}
          <div className="hidden md:flex items-center gap-3 cursor-pointer">
            <div className="relative">

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <UserCircleIcon className="w-10 h-10 text-(--accent)" />
                <span className="font-semibold text-xl">
                  {user?.username}
                </span>
                <ChevronDownIcon className="w-6 h-6" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-(--primary) rounded-lg shadow-lg border border-(--secondary)">

                  <button className="block w-full text-center px-6 py-2 hover:bg-(--secondary)">
                    Profile
                  </button>

                  <button
                    onClick={handlelogout}
                    className="block w-full text-center px-6 py-2 hover:bg-(--secondary) text-red-400"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-(--accent)"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <XMarkIcon className="w-7 h-7" />
            ) : (
              <Bars3Icon className="w-7 h-7" />
            )}
          </button>

        </div>

      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden bg-(--primary) border-t border-(--secondary) px-4 py-3">

          <div className="flex items-center gap-3">
            <UserCircleIcon className="w-8 h-8 text-(--accent)" />
            <span className="font-medium">{user?.username}</span>
          </div>

          <button
            onClick={handlelogout}
            className="mt-3 text-red-400"
          >
            Logout
          </button>

        </div>
      )}

    </header>
  );
}

export default VendorNavbar;