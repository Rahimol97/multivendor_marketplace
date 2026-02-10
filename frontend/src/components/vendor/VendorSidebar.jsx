import React, {useState,useEffect} from "react";
import { NavLink } from "react-router-dom";
import api from '../../api'
import {
  HomeIcon,CheckCircleIcon,XMarkIcon ,ShoppingBagIcon,
  ClipboardDocumentListIcon,NoSymbolIcon,ExclamationTriangleIcon,ClipboardDocumentCheckIcon 
} from "@heroicons/react/24/outline";

function VendorSidebar({ collapsed, mobileOpen, setMobileOpen }) {
  const [lowStockcount, setLowStockcount] = useState(0);
  const menuItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition
     ${
       isActive
         ? "bg-(--accent) text-(--primary)"
         : "text-(--text) hover:bg-(--secondary) hover:text-(--accent)"
     }`;
     /////get low stock count 
     useEffect(() => {
  const fetchLowStockcount = async () => {
    const res = await api.get("/vendor/lowstock");
    setLowStockcount(res.data.lowStockcount);
  };

  fetchLowStockcount();
  const interval = setInterval(fetchLowStockcount, 30000); // refresh

  return () => clearInterval(interval);
}, []);

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
   ${collapsed ? "md:w-20" : "md:w-80"} w-80
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
          <NavLink to="/vendor" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <HomeIcon className="w-6 h-6" />
            {!collapsed && "Dashboard"}
          </NavLink>
        <NavLink to="/vendor/addproduct" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <ShoppingBagIcon className="w-6 h-6" />
            {!collapsed && "Add Product"}
          </NavLink>
        <NavLink to="/vendor/productlist" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <ClipboardDocumentListIcon className="w-6 h-6" />
            {!collapsed && "MY Product List"}
          </NavLink>
           <NavLink to="/vendor/blockedlist" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <NoSymbolIcon  className="w-6 h-6" />
            {!collapsed && "Blocked Products"}
          </NavLink>
           <NavLink to="/vendor/lowstock" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <ExclamationTriangleIcon   className={`w-6 h-6 ${
      lowStockcount > 0 ? "text-red-400 animate-pulse" : ""
    }`} />
            {!collapsed && (
    <span
      className={`${
        lowStockcount > 0 ? "text-red-400 font-semibold animate-pulse" : ""
      }`}
    >
      Low Stock Alerts
    </span>
  )}
           {!collapsed && lowStockcount > 0 && (
    <span className="ml-auto relative flex h-5 w-5 items-center justify-center">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs font-semibold">
        {lowStockcount}
      </span>
    </span>
  )}
          </NavLink>
              <NavLink to="/vendor/vendororder" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
            {!collapsed && "Update OrderStatus"}
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default VendorSidebar;
