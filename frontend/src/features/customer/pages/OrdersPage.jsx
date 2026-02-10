import { useEffect, useState } from "react";
import api from "../../../api";
import { useAuth } from "../../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getSocket  } from '../../../../socket'
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

function OrdersPage() {
  const { customerId } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
const socket = getSocket();
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get(`/customer/customerorders/${customerId}`);
      setOrders(res.data.orders);

    };
    fetchOrders();
  if (!customerId) return;

  socket.emit("joinOrderRoom", customerId);

  const handleUpdate = ({ vendorOrderId, status }) => {
    setOrders(prev =>
      prev.map(order =>
        order.vendorOrders?.some(v => v._id === vendorOrderId)
          ? { ...order, orderStatus: status }
          : order
      )
    );
  };
socket.on("orderStatusUpdated", handleUpdate);
  return () => {
    socket.off("orderStatusUpdated",handleUpdate);
  };

  }, [customerId]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
     <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
       <div className="relative flex items-center justify-center h-14 px-4">
     
         {/* Back Button (absolute so it doesn’t affect centering) */}
         <button
           onClick={() => navigate(-1)}
           className="absolute left-4 bg-white p-2 rounded-full shadow"
         >
           <ArrowLeftIcon className="w-6 h-6" />
         </button>
     
        
       </div>
     </div>
      <h1 className="text-xl font-bold mb-4 mt-14">My Orders</h1>

      {orders.map(order => (
        <div
          key={order._id}
          onClick={() => navigate(`/customer/product/orderdetails/${order._id}`)}
          className="bg-white p-4 rounded-lg shadow mb-3 cursor-pointer"
        >
          <p className="font-semibold">Order Placed</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toDateString()}
          </p>
          <p className="mt-2 font-bold text-[rgb(1,135,144)]">
            ₹{order.grandTotal.toFixed(2)}
          </p>
          <p className="text-sm mt-1">Status: {order.orderStatus}</p>
        </div>
      ))}
    </div>
  );
}

export default OrdersPage;
