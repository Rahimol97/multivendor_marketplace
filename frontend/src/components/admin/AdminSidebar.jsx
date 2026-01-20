import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function AdminSidebar({ collapsed, mobileOpen, setMobileOpen }) {
  const menuItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition
     ${
       isActive
         ? "bg-(--accent) text-(--primary)"
         : "text-(--text) hover:bg-(--secondary) hover:text-(--accent)"
     }`;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
         className={`
    fixed md:static z-50
    h-screen bg-(--secondary) border-r border-slate-200
    transform transition-all duration-300 ease-in-out
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    ${mobileOpen ? "w-80" : collapsed ? "w-20" : "w-80"}
  `}
>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-primary font-bold">
              M
            </div>
            {!collapsed && (
              <span className="text-lg font-bold font-serif">
                Multi<span className="text-(--accent)">NEST</span>
              </span>
            )}
          </div>

          {/* Close Button (Mobile) */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        {/* Menu */}
        <nav className="px-3 py-4 space-y-5">
          <NavLink to="/admin" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <HomeIcon className="w-6 h-6" />
            {!collapsed && "Dashboard"}
          </NavLink>

          <NavLink to="/admin/vendor_approvals" className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <CheckCircleIcon className="w-6 h-6" />
            {!collapsed && "Vendor Approvals"}
          </NavLink>

          <NavLink to="/admin/commission" className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <Cog6ToothIcon className="w-6 h-6" />
            {!collapsed && "Commission Settings"}
          </NavLink>

          <NavLink to="/admin/accounts" className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <UsersIcon className="w-6 h-6" />
            {!collapsed && "User / Vendor Management"}
          </NavLink>

          <NavLink to="/admin/orders" className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <ClipboardDocumentListIcon className="w-6 h-6" />
            {!collapsed && "Orders"}
          </NavLink>

          <NavLink to="/admin/reports" className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <ChartBarIcon className="w-6 h-6" />
            {!collapsed && "Reports"}
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;
