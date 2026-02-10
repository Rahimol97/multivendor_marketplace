import { Outlet,useLocation  } from "react-router-dom";
import { useState,useEffect } from "react";
import Rolenasednavbar from "../components/common/Rolenasednavbar";
import { useNavigate } from "react-router-dom";
import { getSocket  } from '../../socket'
import { useAuth } from "../components/context/AuthContext";
import { useDispatch } from "react-redux";
import { setDeliveryAddress } from "../redux/cartSlice";
function CustomerLayout() {
   const navigate = useNavigate();
     const { user,loading,customerAddress, customerMobile  } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
 const location = useLocation();
 const dispatch = useDispatch();
useEffect(() => {
  if (!loading && !user) {
    navigate("/"); // go to login page
  }
}, [user, loading, navigate]);

useEffect(() => {
  if (customerAddress?.length > 0) {
    dispatch(setDeliveryAddress({
      address: customerAddress[0],
      mobile: customerMobile
    }));
  }
}, [customerAddress, customerMobile, dispatch]);
  // Hide navbar on product details page
  const hideNavbar  =location.pathname.startsWith("/customer/product/"); 
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
//////soket
 useEffect(() => {
   const socket = getSocket();
    if (user) {
      socket.connect();
      console.log(" Customer socket connected");
    }

    return () => {
      socket.disconnect();
      console.log(" Customer socket disconnected");
    };
  }, [user]);
  return (
    <div className="flex w-full min-h-screen bg-(--primary) text-(--text) overflow-hidden">
      

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
     {!hideNavbar  && <Rolenasednavbar 
          
          setMobileOpen={setMobileOpen}
        />}
        
        <main className="flex-1 min-w-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
