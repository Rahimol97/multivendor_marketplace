import { Outlet } from "react-router-dom";
import { useState,useEffect } from "react";
import Rolenasednavbar from "../components/common/Rolenasednavbar";
import { useNavigate } from "react-router-dom";

function CustomerLayout() {
   const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
useEffect(() => {
  const handler = (e) => {
    // Ctrl + A opens Admin Login
    if (e.ctrlKey && e.key.toLowerCase() === "a") {
      e.preventDefault(); // prevents browser "select all"
      navigate("/admin/authadmin");
    }
  };

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [navigate]);

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
