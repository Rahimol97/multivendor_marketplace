import { Outlet } from "react-router-dom";
import { useState } from "react";
import Rolenasednavbar from "../components/common/Rolenasednavbar";

function CustomerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-(--primary) text-(--text) overflow-hidden">
      

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Rolenasednavbar
          
          setMobileOpen={setMobileOpen}
        />

        <main className="p-6 flex-1 min-w-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
