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
import Category from "../features/admin/pages/Category";
/////vendor pages
import Addproduct from "../features/vendor/pages/Addproduct";
import ProductList from "../features/vendor/pages/ProductList";
import BlockedList from "../features/vendor/pages/BlockedList"
import Lowstock from "../features/vendor/pages/Lowstock";

///////////customer pages
import Home from "../features/customer/pages/Home"
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
        {path:"/admin/category",element:<Category />}

    ],
},

//vendor routes can be added here
{
  path :"/vendor",
  element:<VendorLayouts/>,
  children:[
      //vendor protected routes go here
 {path:"/vendor/addproduct",element:<Addproduct/>},
 {path:"/vendor/editproduct/:id",element:<Addproduct/>},
 {path:"/vendor/productlist",element:<ProductList />},
 {path:"/vendor/blockedlist",element:<BlockedList />},
 {path:"/vendor/lowstock",element:<Lowstock />}

],
  
},
///////customer layouts
{
  path :"/customer",
  element:<CustomerLayout/>,
  children:[
  {index:true,element:<Home/>},
   
  ],
  
}
]);