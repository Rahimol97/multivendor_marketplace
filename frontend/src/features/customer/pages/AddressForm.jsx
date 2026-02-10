import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../components/context/AuthContext";
import api from "../../../api";
import { ArrowLeftIcon} from "@heroicons/react/24/outline";

function AddressForm() {
  const { addressId } = useParams(); // undefined = Add mode
  const { user,customerId } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const isEdit = Boolean(addressId);
const userId = user.id?user.id:user.user_id;
useEffect(() => {
  const fetchAddress = async () => {
    try {
      if (isEdit) {
        const response = await api.get(`/customer/getprofile/${userId}`);
        const addr = response.data.customer.address.find(
          (a) => a._id === addressId
        );

        if (addr) setForm(addr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchAddress();
}, [addressId, isEdit, user]);


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      await api.put(`/customer/editaddress/${customerId}/${addressId}`, form);
    } else {
      await api.post(`/customer/addaddress/${customerId}`, form);
    }
navigate(-1);

  };

  return (
    <div className="relative max-w-lg mx-auto p-6 ">
       <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
      </button>
     
      <h2 className="text-xl font-bold mt-8">
        {isEdit ? "Edit Address" : "Add New Address"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        <input
          name="street"
          value={form.street}
          onChange={handleChange}
          placeholder="Street"
          className="w-full border border-slate-200 focus:outline-none p-2 rounded"
          required
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border border-slate-200 focus:outline-none p-2 rounded"
          required
        />
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="w-full border p-2 border-slate-200 focus:outline-none rounded"
          required
        />
        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="w-full border p-2 border-slate-200 focus:outline-none rounded"
          required
        />

        <button className="w-full bg-(--dark-teal) text-white py-3 rounded">
          {isEdit ? "Update Address" : "Save Address"}
        </button>
      </form>
    </div>
  );
}

export default AddressForm;
