import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api";
import Progessbar from './Progessbar'
import {getSocket } from "../../../../socket"
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function OrderdetailsPage() {
     const { orderId } = useParams();
         const navigate = useNavigate();
     
  const [order, setOrder] = useState(null);
  const [vendors, setVendors] = useState([]);
  const socket = getSocket();
  useEffect(() => {
    const fetchDetails = async () => {
      const res = await api.get(`/customer/orderdetails/${orderId}`);
      setOrder(res.data.order);
      setVendors(res.data.vendorOrders);
    console.log(res.data.vendorOrders);
    };
    fetchDetails();

  }, [orderId]);
/////socket connection 
  useEffect(() => {
  if (!order?.customer_id) return;


socket.emit("joinOrderRoom", order.customer_id);

  //  live status updates
  const handleStatusUpdate = ({ vendorOrderId, status }) => {

    setVendors(prev =>
      prev.map(v =>
        v._id === vendorOrderId
          ? {
              ...v,
              orderStatus: status,
              statusHistory: [
                ...v.statusHistory,
                { status, date: new Date() }
              ]
            }
          : v
      )
    );
  };

  socket.on("orderStatusUpdated", handleStatusUpdate);

  //  Cleanup
  return () => {
    socket.off("orderStatusUpdated", handleStatusUpdate);
  };
}, [order?.customer_id]);

 if (!order) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading order details...
      </div>
    );
  }    
   return (
    <div className="p-4 bg-gray-100 min-h-screen">
     <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
       <div className="relative flex items-center justify-center h-14 px-4">
     
         {/* Back Button  */}
         <button
           onClick={() => navigate(-1)}
           className="absolute left-4 bg-white p-2 rounded-full shadow"
         >
           <ArrowLeftIcon className="w-6 h-6" />
         </button>
     
        
       </div>
     </div>
      <h2 className="text-lg font-bold mb-7 mt-14">Order Tracking</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <p className="font-semibold">Order ID: {order.orderNumber}</p>
        <p>Status: {order.orderStatus}</p>
        <p>Total: ₹{order.grandTotal.toFixed(2)}</p>
      </div>

   {vendors.map(v => (
  <div key={v._id} className="bg-white p-4 rounded-lg shadow mb-4">
    
    <p className="font-semibold text-lg">Seller: {v.vendor_id.shopName}</p>
    <p className="text-sm mb-2">Status: <span className="capitalize">{v.orderStatus}</span></p>

   
    {v.items.map((item, idx) => (
      <div key={idx} className="flex gap-3 items-center border-b py-2">
        <img
          src={item.product_id.images?.[0]?.url || item.product_id.images?.[0]}
          alt={item.product_id.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <p className="font-medium">{item.product_id.name}</p>
          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
       <button
        onClick={() =>
          navigate(`/customer/product/productreview/${order._id}/${item.product_id._id}`)
        }
        className="mt-2 text-sm bg-(--accent) text-white px-3 py-1 rounded-md cursor-pointer hover:opacity-90"
      >
        Rate Product
      </button>
       
        </div>
      </div>
    ))}


    <Progessbar currentStatus={v.orderStatus} />

  
    <div className="mt-4">
      {v.statusHistory.map((s, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <span className="capitalize">{s.status}</span>
          <span>— {new Date(s.date).toLocaleString()}</span>
        </div>
      ))}
    </div>

  </div>
))}

    </div>
  );
}

export default OrderdetailsPage