import React from 'react'
import { useAuth } from "../context/AuthContext";
import AdminNavbar from "../admin/AdminNavbar";
import VendorNavbar from "../vendor/VendorNavbar";
import CustomerNavbar from '../customer/CustomerNavbar';

function Rolenasednavbar(props) {
     const { user, loading } = useAuth();
      if (loading) return null;
  if (!user) return null;

  if (user.role === "admin" ) {
    return <AdminNavbar {...props} />;
  }

  if (user.role === "vendor") {
    return <VendorNavbar {...props} />;
  }

  if (user.role === "customer") {
    return <CustomerNavbar {...props} />;
  }
  return null;
}

export default Rolenasednavbar