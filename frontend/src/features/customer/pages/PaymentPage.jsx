import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import {useAuth } from '../../../components/context/AuthContext'
import api from '../../../api'

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
    const { user,customerId } = useAuth();

  const { cart } = useSelector(state => state.cart);
console.log(cart);
  const checkoutType = location.state?.type;
  const selectedProductId = location.state?.productId;
const getId = (p) => {
  if (!p) return null;
  return typeof p === "object" ? String(p._id) : String(p);
};
const singleItem = cart.items.find(
  (item) => getId(item.product_id) === String(selectedProductId)
);
  const TAX_RATE = 0.05;

const singleSubTotal = singleItem
  ? singleItem.price * singleItem.quantity
  : 0;

const singletax = singleItem
  ? singleSubTotal * TAX_RATE
  : 0;

const singleTotal = singleItem
  ? singleSubTotal + singletax - (singleItem.itemDiscount || 0)
  : 0;

  const amount = checkoutType === "cart" ? cart.grandTotal : singleTotal;
  const [method, setMethod] = useState("cod");
const [showCardForm, setShowCardForm] = useState(false);
  const [popup, setPopup] = useState(null);
 const showSuccess = () => {
    setPopup("success");
    setTimeout(() => navigate("/customer/product/orders"), 2000);
  };

  const showFail = () => {
    setPopup("fail");
  };
const orderPayload = {
  customer_id :customerId,
  items :checkoutType === "cart" ?cart.items.map(item => ({
        product_id: item.product_id._id,
        vendor_id: item.product_id.vendor_id,
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item.product_id.discountedPrice,
        itemSubTotal: item.itemSubTotal,
        itemDiscount: item.itemDiscount,
        itemTotal: item.itemTotal,

         productName: item.product_id.name,
      category: item.product_id.category,
      sku: item.product_id.sku
      })) : [{
    product_id: singleItem.product_id._id,
        vendor_id: singleItem.product_id.vendor_id,
        quantity: singleItem.quantity,
        price: singleItem.price,
        discountedPrice: singleItem.product_id.discountedPrice,
        itemSubTotal: singleItem.itemSubTotal,
        itemDiscount: singleItem.itemDiscount,
        itemTotal: singleItem.itemTotal,
            productName: singleItem.product_id.name,
      category: singleItem.product_id.category,
      sku: singleItem.product_id.sku
      }],
subTotal: checkoutType === "cart"
    ? cart.subTotal
    : singleItem.itemSubTotal,

  tax: checkoutType === "cart"
    ? cart.tax
    : singletax,

  discount: checkoutType === "cart"
    ? cart.discount
    : singleItem.itemDiscount,

  grandTotal: checkoutType === "cart"
    ? cart.grandTotal
    : singleTotal,
       deliveryAddress: {
    street: cart.deliveryAddress?.street,
    city: cart.deliveryAddress?.city,
    state: cart.deliveryAddress?.state,
    pincode: cart.deliveryAddress?.pincode,
    mobile: cart.mobile
  },
 
 
};
  //////payment 
const handlePayment = async () => {
  try{
    if (!cart.deliveryAddress) {
  alert("Please select a delivery address");
  navigate(-1);
  return;
}
if (!cart.items.length) {
  alert("Cart is empty");
  return;
}
  if (method === "cod") {
    await api.post("/payment/cod", orderPayload);
    showSuccess();
    return;
  }

  const { data } = await api.post("/payment/create-razorpay-order", {
    amount
  });

  const options = {
    key: data.key,
    amount: data.amount * 100,
    currency: "INR",
    order_id: data.orderId,
    handler: async function (response) {
      await api.post("/payment/verifypayment", {
        ...response,
        orderData: orderPayload,
      });
      showSuccess();
    },
  };

  new window.Razorpay(options).open();
}
catch (err) {
    console.error(err);
    showFail();
  }
};



return (
    <div className="bg-(--light-bg) min-h-screen pb-24">

      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
        <div className="relative flex items-center justify-center h-14 px-4">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 bg-white p-2 rounded-full shadow"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>

          {/* Stepper */}
          <div className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-300 text-white">1</div>
              <span>Review</span>
            </div>

            <div className="w-16 h-0.5 bg-[rgb(1,135,144)]"></div>

            <div className="flex items-center gap-2 text-[rgb(1,135,144)]">
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[rgb(1,135,144)] text-white">2</div>
              <span>Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* payment methods */}
     <div className="mt-16 p-4 space-y-4">

  {/* COD */}
  <div className="bg-white p-4 rounded-xl shadow">
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        checked={method === "cod"}
        onChange={() => setMethod("cod")}
      />
      <div>
        <p className="font-semibold">Cash on Delivery</p>
        <p className="text-sm text-gray-500">Pay when order arrives</p>
      </div>
    </label>
  </div>

  {/* razorpay */}
  <div className="bg-white p-4 rounded-xl shadow ">
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        checked={method === "online"}
        onChange={() => setMethod("online")}
      />
      <div>
        <p className="font-semibold text-[rgb(1,135,144)]">
          Pay Online
        </p>
        <p className="text-sm text-gray-500">
          UPI, Cards, Wallets, Net Banking
        </p>
      </div>
    </label>

    {method === "online" && (
      <div className="mt-4 ml-6 text-sm text-gray-600">
        Secure payments powered by Razorpay
      </div>
    )}
  </div>

</div>


      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md p-4 flex justify-between items-center">
        <p className="text-xl font-bold">₹{amount.toFixed(2)}</p>
        <button onClick={handlePayment} className="bg-[rgb(1,135,144)] text-white cursor-pointer px-6 py-2 rounded-lg font-semibold shadow">
          Pay Now
        </button>
      </div>
      {/* popup */}
{popup && (
  <div className={`fixed bottom-0 left-0 w-full p-4 transition-transform duration-500 ${popup === "success" ? "bg-green-600" : "bg-red-600"} text-white`}>
    <p className="text-center font-semibold">
      {popup === "success" ? "Payment Successful! 🎉" : "Payment Failed ❌"}
    </p>
  </div>
)}
{/* end popup */}
    </div>
  );
}

export default PaymentPage;
