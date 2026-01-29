import { Outlet } from "react-router-dom";
import { useState } from "react";
import VendorSidebar from "../components/vendor/VendorSidebar";
import Rolenasednavbar from "../components/common/Rolenasednavbar";

function VendorLayouts() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-(--primary) text-(--text) overflow-hidden">
      
      {/* Sidebar */}
      <VendorSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Rolenasednavbar
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

export default VendorLayouts;
