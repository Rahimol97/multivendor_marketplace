import { UsersIcon,UserGroupIcon ,ClockIcon ,CurrencyDollarIcon,BanknotesIcon, ShoppingBagIcon} from '@heroicons/react/24/outline'
import {useEffect,useState} from 'react'
import api from '../../../api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

function AdminDashboard() {
const[stats,setStats] =useState({
  totalCustomers:0,
  totalVendors:0,
  pendingVendors:0,
  activeVendors:[],
  todaySalesAmount:0,
  todayplatformEarnings:0,
  todayvendorPayout:0,

})
const [orders,Setorders] =useState([]);
const [earningsData, setEarningsData] = useState([]);
const [statusData, setStatusData] = useState([]);
const statusColors = {
pending:"bg-yellow-100 text-yellow-700",
confirmed: "bg-blue-100 text-blue-700",
shipped: "bg-purple-100 text-purple-700",
delivered: "bg-green-100 text-green-700",
cancelled: "bg-red-100 text-red-700",
};
const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#A28BFE"];

const fetchCharts = async () => {
  const earnRes = await api.get("/admin/earningslast7days");
  setEarningsData(earnRes.data.data);

  const statusRes = await api.get("/admin/orderstatusstats");
  setStatusData(statusRes.data.data);
};
useEffect(() => {

getDashboardStat();//initial call
todayOrders();
 fetchCharts();

//refresh every 5 second
const interval = setInterval(() => {
 getDashboardStat(); 
 todayOrders();
}, 5000);
return () => clearInterval(interval); // cleanup
 
},[])

const getDashboardStat =async()=>{
  try{
const response = await api.get("/admin/dashboard-stats")
console.log(response)
setStats({
  totalCustomers:response.data.data.customerCount,
  totalVendors:response.data.data.vendorCount,
  pendingVendors:response.data.data.pendingVendors,
  activeVendors:response.data.data.activeVendors,
  todaySalesAmount:response.data.data.todaySalesAmount,
    todayplatformEarnings:response.data.data.todayPlatformEarnings,
  todayvendorPayout:response.data.data.todayVendorPayout,
 })
}
    catch(error){
alert(`Error: ${error.message}`);
  }
};
const todayOrders = async()=>{
  try{
   const response = await api.get("customer/todayorders")
   Setorders(response.data.final);
  }
    catch(error){
alert(`Error: ${error.message}`);
  }
}


  return (
  <div className='space-y-8'>
    <div>
      <h1 className='text-2xl text-(--text) font-bold'>Dashboard</h1>
      <p className='text-sm text-(--text)'> Platform overview & performance</p>
    </div>
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
<StatCard
 title="Total Customers"
value={stats.totalCustomers}
icon={UsersIcon}
color="text-blue-600 bg-blue-100"
/>
 <StatCard
 title="Total Vendors"
value={stats.totalVendors}
icon={UserGroupIcon}
color="text-purple-600 bg-purple-100"
/>
<StatCard
 title="Pending Vendors"
value={stats.pendingVendors}
icon={ClockIcon}
color="text-red-600 bg-red-100"
/>
<StatCard
 title="Total Sales"
value={`₹${stats.todaySalesAmount}`}
icon={CurrencyDollarIcon}
color="text-emerald-600 bg-emerald-100 "
/>
 <StatCard
          title="Platform Earnings"
          value={`₹${stats.todayplatformEarnings}`}
          icon={BanknotesIcon}
          color="text-pink-600 bg-pink-100"
        />
</div>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
         {/* TODAY ORDERS */}
         <div className='lg:col-span-8 bg-(--secondary) rounded-xl p-6 shadow-md'>
         
          <div className='flex flex-center justify-between mb-2'>
        <h2 className='text-2xl font-semibold'>Todays order</h2>
        <ShoppingBagIcon className='w-6 h-6 text-(--accent)' />
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-b-(--accent) text-left text-(--text)'> 
                  
<th className="py-5">Order ID</th>
            <th>product</th>
            <th>customer</th>
            <th>Vendor</th>
            <th>Status</th>
            <th className="text-right">Amount</th>
          </tr>               
              </thead>
              <tbody>
             {orders.map((item)=>(
              <tr key={item._id} className='border-b border-b-slate-300 last:border-0 hover:bg-gray-50 transition'>
                 <td className='py-6 font-medium text-(--text)'>{item.order_id?.orderNumber}</td>
              <td>
              <div className='flex flex-center gap-3'>
                <img
                  src={item.product_id?.images?.[0].url}
                    alt={item.productName}
                    className="w-8 h-8 rounded-md"
                  />
                  <span className="font-medium">{item.product_id?.name}</span>  
              
               </div>
              </td>
             <td className="text-(--text)">{item.customer_id?.customerName}</td>
             <td className="text-(--text)">{item.vendor_id?.shopName}</td>
               <td>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.orderStatus] || "bg-gray-100 text-gray-700" }`}>
                  {item.orderStatus}
                </span>
              </td>
              <td className="text-right font-semibold">
                ₹{item.total}
              </td>
              </tr>
             ))}
              </tbody>
            </table>
          </div>

         </div>
               <div className="lg:col-span-4 space-y-6">
          <div className='bg-(--secondary) rounded-xl p-6 shadow-md'>
         <h3 className='font-semibold mb-4'>Active Vendors</h3>
          <ul className='space-y-3'>
          {stats.activeVendors.map((vendor,i)=>(
            <li key={i} className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                 <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
               {vendor?.shopName?.[0]?.toUpperCase()}
              </div>
              <div className='flex flex-col'>
               <span className="text-sm font-medium">{vendor.shopName}</span>
               <span className="text-xs font-medium">{formatDateTime(vendor.lastLoginAt)}</span>
               </div>
              </div>
                 <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </li>
          ))}
          </ul>
          </div>
         </div>
        </div>
  {/* charts  */}
<div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">

  {/* Last 7 Days Earnings */}
  <div className="bg-(--secondary) rounded-xl p-6 shadow-md">
    <h3 className="font-semibold mb-4">Last 7 Days Platform Earnings</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={earningsData}>
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
 <Bar dataKey="total" radius={[6,6,0,0]}>
    {earningsData.map((entry, index) => (
      <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Bar>
        </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Order Status Pie */}
  <div className="bg-(--secondary) rounded-xl p-6 shadow-md">
    <h3 className="font-semibold mb-4">Orders by Status</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={statusData}
          dataKey="count"
          nameKey="_id"
          outerRadius={100}
          label
        >
         {statusData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

</div>

  </div>


  )
}
/*statcard component */
function StatCard({title,value,icon:Icon,color}){
return (
  <div className='bg-(--secondary) rounded-lg shadow-md p-5 hover:shadow-lg transistion'>
    <div className='flex items-center justify-between'>
    <div>
      <p className='text-(--text)'>{title}</p>
      <h3 className='text-lg font-bold mt-1'>{value}</h3>
    </div>
    <div className={`w-11 h-11 rounded-lg flex flex-center justify-center ${color}`}>
<Icon className="w-6 h-6 mt-2"  />
    </div>
    </div>
  </div>
)
}

////date
const formatDateTime = (date) => {
  if (!date) return "Never logged in";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
};

export default AdminDashboard