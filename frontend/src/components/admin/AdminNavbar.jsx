import { useState } from "react";
import {useAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import api  from '../../api'

import {
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ViewColumnsIcon,
  ChevronLeftIcon,
  RectangleGroupIcon,
  SunIcon, MoonIcon 
} from "@heroicons/react/24/outline";
import { useAdminTheme } from "../context/AdminThemeContext"
function AdminNavbar({ collapsed, setCollapsed, setMobileOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user,setUser, loading }= useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useAdminTheme();
if (loading) return null;
  const handlelogout =async()=>{
   
    await api.post("/users/logout");
    setUser(null);
    navigate("/admin/authadmin");
  }

  const subadminregister =()=>{
    navigate("/admin/authadmin?mode=subadmin");
  }
  return (
    <header className='w-full min-w-0 bg-(--secondary) text-(--text) border-b border-b-slate-200  '>
      <div className='px-4 md:px-6 py-7 flex items-center justify-between w-full min-w-0'>
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-(--accent)"
            onClick={() => setMobileOpen(true)}
          >
            <RectangleGroupIcon  className="w-7 h-7" />
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block  text-(--accent)"
          >
            {collapsed ? (
              <ViewColumnsIcon className="w-7 h-7 cursor-pointer" />
            ) : (
              <ChevronLeftIcon className="w-7 h-7 cursor-pointer" />
            )}
          </button>

        </div>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-3 cursor-pointer">
        
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
        <button onClick={subadminregister} className="bg-(--accent) px-4 py-2 text-(--secondary) rounded-2xl hover:text-amber-300 cursor-pointer">subadmin</button>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2"
            >
              <UserCircleIcon className="w-10 h-10 text-(--accent)" />
              <span className="font-semibold text-xl">{user?.username }</span>
              <ChevronDownIcon className="w-6 h-6 cursor-pointer " />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-primary rounded-lg shadow-lg border border-(--secondary)">
                <button className="block w-full text-center px-6 py-2 hover:bg-secondary">
                  Profile
                </button>
                <button onClick={handlelogout}  className="block w-full text-center cursor-pointer px-6 py-2 hover:bg-secondary text-red-400">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center gap-3">
                  <button
      onClick={toggleTheme}
      className=" md:hidden flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 w-full"
    >
      {darkMode ? (
        <>
          <SunIcon className="w-6 h-6 text-yellow-400" />
         
        </>
      ) : (
        <>
          <MoonIcon className="w-6 h-6 text-(--accent)" />
         
        </>
      )}
    </button>
        <button
          className="md:hidden text-(--accent)"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <XMarkIcon className="w-7 h-7 cursor-pointer" />
          ) : (
            <Bars3Icon className="w-7 h-7 cursor-pointer" />
          )}
        </button>
        </div>
      </div>
      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="md:hidden bg-(--primary) border-t border-(--secondary) px-4 py-3">
          <div className="flex items-center gap-3">
            <UserCircleIcon className="w-8 h-8 text-(--accent)" />
            <span className="font-medium">{user?.username }</span>
          </div>
   
    {/* Subadmin Button */}
    <button
      onClick={subadminregister}
      className="w-full bg-(--accent) px-4 py-2 text-(--secondary) rounded-xl"
    >
      Subadmin
    </button>

  
 
        </div>
      )}
    </header>
  )
}

export default AdminNavbar