import { ArrowLeftIcon,PhoneIcon } from "@heroicons/react/24/outline";
import { useNavigate ,useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import Addressbox from "../../../components/common/Addressbox";
import {useAuth } from '../../../components/context/AuthContext'
import { useDispatch } from "react-redux";
import { setDeliveryAddress } from "../../../redux/cartSlice";

function ReviewPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { cart } = useSelector(state => state.cart);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const { user,customerAddress, customerMobile } = useAuth();
  const selectedProductId = productId;
const getId = (p) => (typeof p === "object" ? p._id : p);
const item = cart.items.find(
  (cartItem) => getId(cartItem.product_id) === selectedProductId
);

const displayAddress = cart.deliveryAddress|| customerAddress?.[0];
const mobile = cart.mobile || customerMobile;
/////product calculation
  const TAX_RATE = 0.05;

const itemPrice = Number(item?.price || 0);
const quantity = Number(item?.quantity || 0);

const subTotal = itemPrice * quantity;
const discount = Number(item?.itemDiscount || 0); // only if backend sends item-level discount
const tax = subTotal * TAX_RATE;
const grandTotal = subTotal + tax - discount;
  //////// 
const vname = cart.items[0]?.vendor_id?.shopName;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
 
///////addressbox autoopen

useEffect(() => {
  if (!selectedProductId) {
    navigate("/customer/product/cart");
  }
}, [selectedProductId, navigate]);
if (!item) {
  return <div className="p-6 text-center">Loading...</div>;
}
  return (
    <div className="bg-(--light-bg) min-h-screen p-4  ">
{/* arrow icon */}
<div className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
  <div className="relative flex items-center justify-center h-14 px-4">

    {/* Back Button (absolute so it doesn’t affect centering) */}
    <button
      onClick={() => navigate(-1)}
      className="absolute left-4 bg-white p-2 rounded-full shadow"
    >
      <ArrowLeftIcon className="w-6 h-6" />
    </button>

    {/* Checkout Steps Centered */}
    <div className="flex items-center gap-2 text-sm font-semibold">

      {/* Step 1 - Active */}
      <div className="flex items-center gap-2 text-[rgb(1,135,144)]">
        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[rgb(1,135,144)] text-white">
          1
        </div>
        <span>Review</span>
      </div>

      <div className="w-16 h-0.5 bg-[rgb(1,135,144)]"></div>

      {/* Step 2 - Inactive */}
      <div className="flex items-center gap-2 text-gray-400">
        <div className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-gray-300">
          2
        </div>
        <span>Payment</span>
      </div>

    </div>
  </div>
</div>
 
      <div className="bg-white rounded-xl p-4 shadow mt-12">
        <img src={item.product_id.images?.[0]?.url} className="w-full h-48 object-cover rounded-lg" />
        <h2 className="font-bold mt-3">{item.productName}</h2>
        <p>Qty: {item.quantity}</p>
        <p className="font-semibold text-[rgb(1,135,144)]">₹{itemPrice}</p>
        <p className="text-sm text-gray-500 mt-1">Sold by { vname }</p>
      </div>

    
      <div className="bg-white mt-4 p-4 rounded-xl shadow">
        <p className="font-semibold text-green-700">
          Estimated Delivery: {deliveryDate.toDateString()}
        </p>
      </div>

      {/* addreess */}
      <div className="bg-white mt-4 p-4 rounded-xl shadow flex justify-between items-center">
        <div>
          <p className="font-bold">Deliver To</p>
    {displayAddress  ? (
  <div className="rounded text-sm text-gray-600">
    Delivering to: {displayAddress .street}, {displayAddress .city}, {displayAddress .state} - {displayAddress .pincode}
    <br />
<div className="flex items-center gap-2 mt-2">
    <PhoneIcon className="h-4 w-4 text-gray-500" />
    <span>{mobile}</span>
  </div>
    </div>
) :  (
  <p className="text-sm text-gray-400">No address selected</p>
)}

          </div>
        <button
          onClick={() => setShowAddressModal(true)}
          className="text-[rgb(0,183,181)] font-semibold"
        >
          Change
        </button>
      </div>

   
      <div className="bg-white mt-4 p-4 rounded-xl shadow">
        <div className="flex justify-between">
          <span>Price</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>   
          <div className="flex justify-between text-red-600">
          <span>Tax</span>
          <span>+₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold mt-2">
          <span>Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

{showAddressModal && (
  <div className="fixed inset-0 z-100 flex items-center justify-center">
    
    {/* Blurred Dark Overlay */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowAddressModal(false)}
    ></div>

    {/* Modal Content */}
    <div className="relative z-50 w-[90%] max-w-md">
      <Addressbox   
        onClose={() => setShowAddressModal(false)}
        onSelect={(addr) => {
           
          dispatch(setDeliveryAddress({
       address: addr,
    mobile: customerMobile
    }));
            setShowAddressModal(false);
        }}
      />
    </div>
  </div>
)}
   <div className="fixed bottom-0 right-0 border-t border-t-slate-200  w-full bg-white z-40 shadow-sm">
        <div className="relative flex items-center  h-14 px-4">
         <p className="text-2xl font-semibold">₹{grandTotal.toFixed(2)}</p>
          <button onClick={() => navigate("/customer/product/payment", { state: { type: "single",  productId: item.product_id._id,} })} className="absolute right-4 bg-(--dark-teal) px-3 py-2 text-white rounded-md shadow">Pay Now
          </button>

        </div>
      </div>
    </div>
  );
}
export default ReviewPage
