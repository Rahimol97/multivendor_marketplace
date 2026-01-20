import { createBrowserRouter } from "react-router-dom";
//layouts
import AdminLayouts from "../layouts/AdminLayouts"
//pages
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import VendorApprovals from "../features/admin/pages/VendorApprovals";
import Commission from "../features/admin/pages/Commission";
import UserVendorManager from "../features/admin/pages/UserVendorManager";
import Orders from "../features/admin/pages/Orders";
import Reports from "../features/admin/pages/Reports";

export const router = createBrowserRouter([
{
    path:"/admin",
    element:<AdminLayouts/>,
    children:[
        {index:true,element:<AdminDashboard/>},
        {path:"/admin/vendor_approvals",element:<VendorApprovals/>},
        {path:"/admin/commission",element:<Commission />},
        {path:"/admin/accounts",element:<UserVendorManager />},
        {path:"/admin/orders",element:<Orders />},
        {path:"/admin/reports",element:<Reports />},


    ],
},

//vendor routes can be added here


]);