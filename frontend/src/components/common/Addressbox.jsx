import React,{useState, useEffect} from 'react'
import { useAuth } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDeliveryAddress } from "../../redux/cartSlice";

function Addressbox({ onClose, onSelect}) {
  const [editing, setEditing] = useState(null);
  const { user,customerId,fetchCustomerProfile,customerMobile } = useAuth();
   const navigate = useNavigate();
       const dispatch = useDispatch();
   
const { customerAddress } = useAuth();
const [selected, setSelected] = useState(null);
 const addresses = customerAddress || [];
const choosedeliveraddr =() => {
    const chosen = addresses.find(a => a._id === selected);
     dispatch(setDeliveryAddress({
    address: chosen,
    mobile: customerMobile
  }));

    onSelect(chosen); 
    onClose();
  };
useEffect(() => {
  if (user?.user_id || user?.id) {
    const userId = user.id?user.id:user.user_id;
    
    fetchCustomerProfile(userId); // 🔄 refresh addresses every open
  }
}, [user]);
  return(
<div className="w-full bg-white rounded-t-2xl shadow-lg p-4 animate-slideUp">
      <div className="flex justify-between mb-3">
        <h2 className="font-bold">Select Address</h2>
        <button onClick={onClose}>✕</button>
      </div>

      <button  onClick={() => navigate("/customer/product/address")} className="w-full border border-[rgb(0,183,181)] text-[rgb(0,183,181)] py-2 rounded mb-3">
        + Add Address
      </button>

      {/* Address list */}
{addresses.map(addr => (
  <div key={addr._id} className="space-y-3">
    
    <label
  className={`flex items-start gap-3 p-3 rounded cursor-pointer border transition
    ${selected === addr._id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:bg-gray-50"}
  `}
>
      
      <input
        type="radio"
        name="address"
        checked={selected === addr._id}
        onChange={() => setSelected(addr._id)}
        className="mt-1"
      />

      <div className="flex-1 text-sm text-gray-700">
        <p className="font-medium text-gray-800">Delivery Address</p>
        <p>
          {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
        </p>
      </div>

      <button
        type="button"
        className="text-sm text-blue-500 hover:underline"
       onClick={() => navigate(`/customer/product/address/${addr._id}`)}
      >
        Edit
      </button>

    </label>

  </div>
))}

      <button onClick={choosedeliveraddr} className="w-full mt-4 bg-[rgb(1,135,144)] text-white py-3 rounded">
        Deliver to this address
      </button>
    </div>
  );
}

export default Addressbox