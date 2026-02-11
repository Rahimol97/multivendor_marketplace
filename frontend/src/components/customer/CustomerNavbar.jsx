import React, { useState, useEffect} from "react";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import {useDispatch, useSelector} from "react-redux";
import { setSearch, fetchProducts } from "../../redux/productSlice";
import {useAuth} from '../context/AuthContext'
import api from '../../api'
import { Link ,useNavigate} from "react-router-dom";

function CustomerNavbar() {
  const [showFooter, setShowFooter] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { user,setUser, loading }= useAuth();
  
  const search = useSelector((state) => state.products.search);
 const cartCount = useSelector((state) => state.cart.count);
  useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      // scrolling down
      setShowFooter(false);
    } else {
      // scrolling up
      setShowFooter(true);
    }
    lastScrollY = window.scrollY;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const handlelogout =async()=>{
   
    await api.post("/users/logout");
    setUser(null);
  }
  if (loading) return null; 
  return (
    <>
      {/* navbar */}
      <nav className="fixed top-0 w-full z-50 shadow-md bg-(--dark-teal) text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg  flex items-center justify-center font-bold text-(--dark-teal)">
                <div className="mx-auto w-16 h-10 rounded-full text-(--accent) 
              flex items-center justify-center"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7l1.664 9.983A2 2 0 006.642 19h10.716a2 2 0 001.978-2.017L21 7M5 7h14M9 11v4M15 11v4"
                />
              </svg>
            </div>
            </div>
            <span className="text-lg font-bold tracking-wide">MultiNest</span>
          </div>

          {/* search bar */}
          <div className="hidden md:flex flex-1 mx-8">
            <div className="w-full relative">
              <input
                type="text" value={search}
                onChange={(e)=>{
                  dispatch(setSearch(e.target.value));
    dispatch(fetchProducts());
                }}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg text-(--light-bg) focus:outline-none border border-(--bright-teal)"
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-(--bright-teal)" />
            </div>
          </div>

          {/* rightside links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to ="/customer" className="hover:text-(--bright-teal) cursor-pointer">Home </Link> 
            <Link to ="/customer/contactus" className="hover:text-(--bright-teal) cursor-pointer">Contact Us </Link> 
           <Link to ="/customer/aboutus"  className="hover:text-(--bright-teal) cursor-pointer">About Us</Link> 

           <Link to ="/customer/product/cart" ><button className="relative hover:text-(--bright-teal)">
              <ShoppingCartIcon className="w-7 h-7" />
              <span className="absolute -top-2 -right-2 bg-(--mid-teal) text-(--light-bg) text-xs px-1.5 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            </button>
</Link>
            <button onClick={() => setProfileOpen(true)} className="hover:text-(--bright-teal)">
              <UserCircleIcon className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* mobie view searchvar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
  type="text"
  value={search}
  onChange={(e) => {
    dispatch(setSearch(e.target.value));
    dispatch(fetchProducts());
  }}
  placeholder="Search products..."
  className="w-full px-4 py-2 rounded-lg text-(--light-bg) focus:outline-none border border-(--bright-teal)"
/>
            <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-(--bright-teal)" />
          </div>
        </div>
      </nav>

      {/* mobile footer view */}
      <div
  className={`fixed bottom-0 left-0 w-full md:hidden bg-(--light-bg) border-t border-gray-200 flex justify-around py-2 z-40 transition-transform duration-300
  ${showFooter ? "translate-y-0" : "translate-y-full"}`}
>  <a href="/customer" className="flex flex-col items-center text-(--dark-teal) hover:text-(--bright-teal)">
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </a>

       <Link to
  ="/customer/product/cart"
  className="flex flex-col items-center text-(--dark-teal) hover:text-(--bright-teal)"
>
  <div className="relative">
    <ShoppingCartIcon className="w-6 h-6" />

    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] min-w-4.5 h-4.5 flex items-center justify-center rounded-full px-1">
        {cartCount}
      </span>
    )}
  </div>

  <span className="text-xs">Cart</span>
</Link>


        <Link to="/customer/product/orders" className="flex flex-col items-center text-(--dark-teal) hover:text-(--bright-teal)">
          <ClipboardDocumentListIcon className="w-6 h-6" />
          <span className="text-xs">Orders</span>
        </Link>

        <button onClick={() => setProfileOpen(true)} className="flex flex-col items-center text-(--dark-teal) hover:text-(--bright-teal)">
          <UserCircleIcon className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>

      {/* sidebar */}
      {profileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setProfileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-72 bg-(--light-bg) shadow-lg z-50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-(--dark-teal)">My Account</h2>
              <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={() => setProfileOpen(false)} />
            </div>

            <nav className="flex flex-col gap-4 text-(--mid-teal) font-medium">
              {/* <Link to="/profile"  className="hover:text-(--bright-teal)">Personal Info</Link> */}
              <Link to="/customer/product/orders" className="hover:text-(--bright-teal) cursor-pointer">My Orders</Link>
              <Link to="/customer/product/wishlist" className="hover:text-(--bright-teal) cursor-pointer">Wishlist</Link>
             <Link to ="/customer/contactus" className="hover:text-(--bright-teal) cursor-pointer">Contact Us</Link> 
           <Link to ="/customer/aboutus" className="hover:text-(--bright-teal) cursor-pointer">About Us</Link> 

              <button onClick={handlelogout} className="text-red-500">Logout</button>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

export default CustomerNavbar;
