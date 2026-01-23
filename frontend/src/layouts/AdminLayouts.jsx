import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

function AdminLayouts() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-(--primary) text-(--text) overflow-hidden">
      
      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <AdminNavbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />

        <main className="p-6 flex-1 min-w-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayouts;
