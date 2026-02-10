import { ArrowLeftIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Addressbox from "../../../components/common/Addressbox";
import { useAuth } from "../../../components/context/AuthContext";
import api from "../../../api";
import { useDispatch } from "react-redux";
import { setDeliveryAddress } from "../../../redux/cartSlice";

function CartReviewPage() {
  const navigate = useNavigate();
    const dispatch = useDispatch();
  const { cart } = useSelector(state => state.cart);
  const { user } = useAuth();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
const deliveryAddress = cart.deliveryAddress;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  useEffect(() => {
    const getAddress = async () => {
      const res = await api.get(`/customer/getprofile/${user.user_id}`);
    const addrList = res.data.customer.address;
    const mob = res.data.customer.mobile;

    setAddress(addrList);
    setMobile(mob);   
      if (addrList?.length > 0 && !cart.deliveryAddress) {
      dispatch(setDeliveryAddress({
        address: addrList[0],
        mobile: mob
      }));
    }
    };
    if (user?.user_id) getAddress();
  },[user, dispatch, cart.deliveryAddress]);

  return (
    <div className="bg-[rgb(244,244,244)] min-h-screen p-4">

      {/* header */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
        <div className="relative flex items-center justify-center h-14 px-4">
          <button onClick={() => navigate(-1)} className="absolute left-4 bg-white p-2 rounded-full shadow">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>

         <div className="flex items-start justify-center gap-6 text-sm font-semibold w-fit mx-auto">

  {/* STEP 1 */}
  <div className=" mt-1 flex flex-col items-center ml-5">
    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[rgb(1,135,144)] text-white">1</div>
    <span className=" text-[rgb(1,135,144)]">Cart</span>
  </div>

  <div className="w-10 h-0.5 bg-gray-300 mt-3"></div>

  {/* STEP 2 */}
  <div className="mt-1 flex flex-col items-center">
    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[rgb(1,135,144)] text-white">2</div>
    <span className=" text-[rgb(1,135,144)]">Review</span>
  </div>

  <div className="w-10 h-0.5 bg-gray-300 mt-3"></div>

  {/* STEP 3 */}
  <div className="mt-1 flex flex-col items-center">
    <div className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-400">3</div>
    <span className=" text-gray-400">Payment</span>
  </div>

</div>

        </div>
      </div>

      {/*cart  */}
      <div className="mt-16 space-y-4">
        {cart.items.map(item => (
          <div key={item.product_id._id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex gap-4">
              <img src={item.product_id.images?.[0]?.url} className="w-24 h-24 rounded-lg object-cover" />
              <div>
                <h2 className="font-bold">{item.productName}</h2>
                <p>Qty: {item.quantity}</p>
                <p className="text-[rgb(1,135,144)] font-semibold">₹{item.itemTotal} <span className="line-through ml-3">  ₹{item.price * item.quantity}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* address*/}
      <div className="bg-white mt-4 p-4 rounded-xl shadow flex justify-between items-center">
        <div>
          <p className="font-bold">Deliver To</p>
          {deliveryAddress ? (
            <div className="text-sm text-gray-600">
              {deliveryAddress.street}, {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
              <div className="flex items-center gap-2 mt-1">
                <PhoneIcon className="h-4 w-4 text-gray-500" />
                {mobile}
              </div>
            </div>
          ) : address?.length > 0 ? (
            <div className="text-sm text-gray-600">
              {address[0].street}, {address[0].city}, {address[0].state} - {address[0].pincode}
              <div className="flex items-center gap-2 mt-1">
                <PhoneIcon className="h-4 w-4 text-gray-500" />
                {mobile}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No address selected</p>
          )}
        </div>

        <button onClick={() => setShowAddressModal(true)} className="text-[rgb(0,183,181)] font-semibold">
          Change
        </button>
      </div>

      {/* order summary */}
      <div className="bg-white mt-4 p-4 rounded-xl shadow">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{cart.subTotal}</span></div>
        <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{cart.discount}</span></div>
        <div className="flex justify-between text-red-600"><span>Tax</span><span>+₹{cart.tax}</span></div>
        <div className="flex justify-between font-bold mt-2"><span>Total</span><span>₹{cart.grandTotal}</span></div>
      </div>

  

      {/* addresspopup */}
      {showAddressModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddressModal(false)}></div>
          <div className="relative z-50 w-[90%] max-w-md">
            <Addressbox
              selected={selectedAddressId}
              setSelected={setSelectedAddressId}
              onClose={() => setShowAddressModal(false)}
              onSelect={(addr) => {
                setDeliveryAddress(addr);
                setSelectedAddressId(addr._id);
                   dispatch(setDeliveryAddress({
      address: addr,
      mobile
    }));
                setShowAddressModal(false);
              }}
            />
          </div>
        </div>
      )}
      {/* bottom  */}
        <div className="fixed bottom-0 right-0 border-t border-t-slate-200  w-full bg-white z-40 shadow-sm">
        <div className="relative flex items-center  h-14 px-4">
         <p className="text-2xl font-semibold">₹{cart.grandTotal.toFixed(2)}</p>
          <button  onClick={() => navigate("/customer/product/payment", { state: { type: "cart" } })} className="absolute right-4 bg-(--dark-teal) px-3 py-2 text-white rounded-md shadow">Pay Now
          </button>

        </div>
      </div>
    </div>
  );
}

export default CartReviewPage;
