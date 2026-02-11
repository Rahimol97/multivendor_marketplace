import { useEffect, useState } from "react";
import api from '../../../api'
const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/vendor/orders");
      console.log(res);
      setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (vendorOrderId, status) => {
    try {
      await api.patch(`/vendor/orderstatusupdate/${vendorOrderId}`, {
        status,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === vendorOrderId ? { ...order, orderStatus: status } : order
        )
      );
    } catch (err) {
      alert("Status update failed");
    }
  };
  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Orders</h1>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 ">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Earning</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Payment method</th>
              <th className="p-4">Status</th>
              <th className="p-4">Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-t-slate-100 hover:bg-gray-50">
                {/* Order Number */}
                <td className="p-4 font-medium">
                  #{order.order_id?.orderNumber}
                  <div className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>

                {/* Customer */}
                <td className="p-4">
                  <div className="font-medium">
                    {order.customer_id?.customerName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.customer_id?.mobile}
                  </div>
                </td>

                {/* Items */}
                <td className="p-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-xs">
                      {item.product_id?.name} × {item.quantity}
                    </div>
                  ))}
                </td>

                {/* Earnings */}
                <td className="p-4 font-semibold text-green-600">
                  ₹{order.vendorEarning}
                </td>

                {/* Payment */}
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.vendorPaymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.vendorPaymentStatus}
                  </span>
                </td>
 <td className="p-4">
                  <span className="px-2 py-1 text-xs font-semibold capitalize">
                    {order.order_id.paymentMethod}
                  </span>
                </td>
                {/* Current Status */}
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize">
                    {order.orderStatus}
                  </span>
                </td>

                {/* Update Status Dropdown */}
                <td className="p-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="border rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
