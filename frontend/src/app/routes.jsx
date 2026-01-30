import { createBrowserRouter } from "react-router-dom";
//layouts
import AdminLayouts from "../layouts/AdminLayouts"
import AuthLayout from "../layouts/AuthLayout"
import VendorLayouts from "../layouts/VendorLayouts";
import CustomerLayout from "../layouts/CustomerLayout";
//admin pages
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import VendorApprovals from "../features/admin/pages/VendorApprovals";
import Commission from "../features/admin/pages/Commission";
import UserVendorManager from "../features/admin/pages/UserVendorManager";
import Orders from "../features/admin/pages/Orders";
import Reports from "../features/admin/pages/Reports";
import Venderorders from "../features/admin/pages/Vendororders";
import Ordertrack from "../features/admin/pages/Ordertrack";
/////vendor pages
import Addproduct from "../features/vendor/pages/Addproduct";
////authentication pages
import Authadmin from '../components/authentication/AuthadminPage'
import Authvendor from "../components/authentication/Authvendor";
import Authcustomer from "../components/authentication/Authcustomer";
export const router = createBrowserRouter([
/////authentication session 

{
path: "/",
 element: <AuthLayout />,
 children:[
    {index:true,element:<Authcustomer/>},
    {path:"admin/authadmin",element:<Authadmin/>},
    {path:"vendor/authvendor",element:<Authvendor/>},
    
 ]
},


    {

    path:"/admin",
    element:<AdminLayouts/>,
    children:[
        {index:true,element:<AdminDashboard/>},
        {path:"/admin/vendor_approvals",element:<VendorApprovals/>},
        {path:"/admin/commission",element:<Commission />},
        {path:"/admin/accounts",element:<UserVendorManager />},
        {path:"/admin/orders",element:<Orders />},
        {path:"/admin/vendororders",element:<Venderorders />},
        {path:"/admin/ordertrack",element:<Ordertrack />},
        {path:"/admin/reports",element:<Reports />},

    ],
},

//vendor routes can be added here
{
  path :"/vendor",
  element:<VendorLayouts/>,
  children:[
      //vendor protected routes go here
 {path:"/vendor/addproduct",element:<Addproduct/>},
 
  ],
  
},
///////customer layouts
{
  path :"/customer",
  element:<CustomerLayout/>,
  children:[
      //vendor protected routes go here
  ],
  
}
]);