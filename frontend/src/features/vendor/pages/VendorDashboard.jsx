import { useEffect, useState } from "react";
import api from "../../../api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const colors = {
  dark: "rgb(0,84,97)",
  mid: "rgb(1,135,144)",
  bright: "rgb(0,183,181)",
  bg: "rgb(244,244,244)"
};

export default function VendorDashboard() {
  const [summary, setSummary] = useState({});
  const [sales, setSales] = useState([]);
  const [status, setStatus] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
     fetchSummary();
  fetchSalesChart();
  fetchOrderStatus();
  fetchTopProducts();
  fetchRecentOrders();
  }, []);
const fetchSummary = async () => {
  try {
    const res = await api.get("/vendor/summary");
    setSummary(res.data);
  } catch (err) {
    console.error("Summary error:", err.response?.data || err.message);
  }
};

const fetchSalesChart = async () => {
  try {
    const res = await api.get("/vendor/sales-chart");
    setSales(res.data);
  } catch (err) {
    console.error("Sales chart error:", err.response?.data || err.message);
  }
};

const fetchOrderStatus = async () => {
  try {
    const res = await api.get("/vendor/order-status");
    setStatus(res.data);
  } catch (err) {
    console.error("Order status error:", err.response?.data || err.message);
  }
};

const fetchTopProducts = async () => {
  try {
    const res = await api.get("/vendor/top-products");
    setTopProducts(res.data);
  } catch (err) {
    console.error("Top products error:", err.response?.data || err.message);
  }
};

const fetchRecentOrders = async () => {
  try {
    const res = await api.get("/vendor/recent-orders");
    setOrders(res.data);
  } catch (err) {
    console.error("Recent orders error:", err.response?.data || err.message);
  }
};
  return (
    <div style={{ background: colors.bg }} className="p-4 sm:p-6 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: colors.dark }}>
        Vendor Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card title="Today's Sales" value={`₹${summary.salesToday || 0}`} color={colors.mid}/>
        <Card title="Orders Today" value={summary.ordersToday || 0} color={colors.bright}/>
        <Card title="Items Sold" value={summary.itemsSold || 0} color={colors.dark}/>
        <Card title="Pending Orders" value={summary.pendingOrders || 0} color="orange"/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3 text-sm sm:text-base">Sales Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sales}>
              <XAxis dataKey="_id" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke={colors.mid} strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3 text-sm sm:text-base">Order Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={status} dataKey="count" nameKey="_id" outerRadius={80}>
                {status.map((_, i) => (
                  <Cell key={i} fill={[colors.mid, colors.bright, colors.dark, "#f59e0b", "#ef4444"][i % 5]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white  p-4 rounded-xl shadow mb-8">
        <h2 className="font-semibold mb-3">Top Selling Products</h2>
        <div className="space-y-2 text-sm sm:text-base">
          {topProducts.map(p => (
            <div key={p._id} className="flex justify-between border-b border-b-slate-200 py-2">
              <span className="truncate max-w-[60%]">{p.name}</span>
              <span>{p.sold} sold | ₹{p.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold  mb-3">Recent Orders</h2>
        <div className="space-y-2 text-sm sm:text-base">
          {orders.map(o => (
            <div key={o._id} className="flex justify-between border-b  border-b-slate-200 py-2">
              <span>Order #{o._id.slice(-6)}</span>
              <span className="capitalize">{o.orderStatus}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="p-4 rounded-xl text-white shadow flex flex-col justify-between min-h-22.5" style={{ background: color }}>
      <p className="text-xs sm:text-sm opacity-90">{title}</p>
      <h2 className="text-xl sm:text-2xl font-bold">{value}</h2>
    </div>
  );
}
