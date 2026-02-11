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
import AdminContactMessages from "../features/admin/pages/AdminContactMessages";

/////vendor pages
import Addproduct from "../features/vendor/pages/Addproduct";
import ProductList from "../features/vendor/pages/ProductList";
import BlockedList from "../features/vendor/pages/BlockedList"
import Lowstock from "../features/vendor/pages/Lowstock";
import VendorOrders from "../features/vendor/pages/VendorOrders";
import VendorDashboard from "../features/vendor/pages/VendorDashboard";

///////////customer pages
import Home from "../features/customer/pages/Home"
import ProductDetails from "../features/customer/ProductDetails";
import CartPage from "../features/customer/pages/CartPage";
import ReviewPage from "../features/customer/pages/ReviewPage";
import AddressForm from "../features/customer/pages/AddressForm";
import CartReviewPage from "../features/customer/pages/CartReviewPage";
import PaymentPage from "../features/customer/pages/PaymentPage";
import OrdersPage from "../features/customer/pages/OrdersPage";
import OrderdetailsPage from "../features/customer/pages/OrderdetailsPage";
import WishlistPage from "../features/customer/pages/WishlistPage";
import AboutUs from "../features/customer/pages/AboutUs";
import ContactUs from "../features/customer/pages/ContactUs";
import Userreview from "../features/customer/pages/Userreview";

////authentication pages
import Authadmin from '../components/authentication/AuthadminPage';
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
        {path:"/admin/category",element:<Category />},
        {path:"/admin/readmessage",element:<AdminContactMessages />}

    ],
},

//vendor routes can be added here
{
  path :"/vendor",
  element:<VendorLayouts/>,
  children:[
      //vendor protected routes go here
  {index:true,element:<VendorDashboard/>},  
 {path:"/vendor/addproduct",element:<Addproduct/>},
 {path:"/vendor/editproduct/:id",element:<Addproduct/>},
 {path:"/vendor/productlist",element:<ProductList />},
 {path:"/vendor/blockedlist",element:<BlockedList />},
 {path:"/vendor/lowstock",element:<Lowstock />},
 {path:"/vendor/vendororder",element:<VendorOrders/>}
],
  
},
///////customer layouts
{
   path :"/customer",
  element:<CustomerLayout/>,
  children:[
  {index:true,element:<Home/>},
        {path:"/customer/product/address",element:<AddressForm />},
      {path:"/customer/product/address/:addressId",element:<AddressForm />},
     {path:"/customer/product/orderdetails/:orderId",element:<OrderdetailsPage />},
    {path:"/customer/product/review/:productId",element:<ReviewPage />},
    {path:"/customer/product/reviewcart",element:<CartReviewPage />},
    {path:"/customer/product/payment",element:<PaymentPage />},
    {path:"/customer/product/orders",element:<OrdersPage />},
    {path:"/customer/product/wishlist",element:<WishlistPage />},
    {path:"/customer/aboutus",element:<AboutUs />},
    {path:"/customer/contactus",element:<ContactUs />},
    
    {path:"/customer/product/cart",element:<CartPage />},
    {path:"/customer/product/:id",element:<ProductDetails />},
    {path:"/customer/product/productreview/:orderid/:productid",element:<Userreview />},
    
  ],
}

]);




