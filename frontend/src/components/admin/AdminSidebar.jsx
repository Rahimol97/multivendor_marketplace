import React, {useState,useEffect} from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  XMarkIcon,CubeIcon,ChatBubbleLeftRightIcon 
} from "@heroicons/react/24/outline";
import api from  '../../api'

function AdminSidebar({ collapsed, mobileOpen, setMobileOpen }) {
 const [ordersOpen, setOrdersOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
 const menuItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition
     ${
       isActive
         ? "bg-(--accent) text-(--primary)"
         : "text-(--text) hover:bg-(--secondary) hover:text-(--accent)"
     }`;

     const fetchUnreadCount = async () => {
  try {
    const res = await api.get("/admin/unreadcontact");
    setUnreadCount(res.data.count);
  } catch (err) {
    console.log("Badge error");
  }
};

useEffect(() => {
  fetchUnreadCount();

  // auto refresh every 30 seconds
  const interval = setInterval(fetchUnreadCount, 30000);
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
          
           <NavLink to="/admin/category" className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <CubeIcon  className="w-6 h-6" />
            {!collapsed && "Category"}
          </NavLink>
<NavLink
  to="/admin/readmessage"
  className={(props) => `${menuItemClass(props)} relative`}
  onClick={() => setMobileOpen(false)}
>
  <div className="flex items-center gap-3 w-full relative">
    <div className="relative">
      <ChatBubbleLeftRightIcon className="w-6 h-6" />

      {collapsed && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-(--secondary)" />
      )}
    </div>

    {!collapsed && <span>User Messages</span>}

    {!collapsed && unreadCount > 0 && (
      <span className="ml-auto bg-red-600 text-white text-[10px] min-w-4.5 h-4.5 flex items-center justify-center rounded-full px-1">
        {unreadCount}
      </span>
    )}
  </div>
</NavLink>



        {/* orders */}
        <div >
          <button onClick={()=>setOrdersOpen(!ordersOpen)}
             className={`${menuItemClass} w-full justify-between `}
            >
        <div className="flex items-center gap-3 cursor-pointer hover:text-(--accent) ">
          <ClipboardDocumentListIcon className="w-6 h-6" />
          {!collapsed && <span>Orders</span>}
        </div>
          </button>
          {ordersOpen && !collapsed && (
        <div className="ml-6 mt-3 flex flex-col  gap-3">
          <NavLink
           to="/admin/orders"
            className={menuItemClass}
            onClick={() => setMobileOpen(false)}
          >
            All Orders
          </NavLink>

          <NavLink
            to="/admin/vendororders"
           className={menuItemClass} onClick={() => setMobileOpen(false)}
          >
            Vendor Wise Orders
          </NavLink>
              <NavLink
            to="/admin/ordertrack"
           className={menuItemClass} onClick={() => setMobileOpen(false)}
          >
           Order Tracking
          </NavLink>
        </div>
      )}
        </div>

          {/* <NavLink to="/admin/orders" className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <ClipboardDocumentListIcon className="w-6 h-6" />
            {!collapsed && "Orders"}
          </NavLink> */}

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
