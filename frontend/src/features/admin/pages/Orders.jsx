import React, {useState,useEffect} from 'react'
import Pagination from '../../../components/common/pagination'
import api from '../../../api'

function Orders() {
  const [datef,setDatef] = useState("")
  const [datet,setDatet] = useState("")
  const [orders,setOrders] = useState([]);
  const[pagec,setPagec] = useState(1);
  const [paginationcount,setPaginationcount] = useState({
    totalpages:1,
    totalorders:0,
  });
  const limit =10;
  
  useEffect(() => {
  const today = new Date().toISOString().split("T")[0];
  setDatef(today);
  setDatet(today);
  }, [])

  useEffect(()=>{
    if(datef && datet){
    getOrders();
    }
  },[pagec]);
  //////get orders
  const getOrders = async()=>{
try{
  const response = await api.get(`/customer/orders?fdate=${datef}&tdate=${datet}&page=${pagec}&limit=${limit}`);

  setOrders(response.data.orders);
  setPaginationcount(response.data.pagination);
}
catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  //submit button 
  const handlesubmit =()=>{
    setPagec(1);
    getOrders();
  }
  return (
    <div className="p-4  md:p-6 w-full min-w-0 " >
      <div className='flex flex-col md:flex-row justify-center items-center gap-3' >
      <input type="date" value={datef} onChange={(e)=>setDatef(e.target.value)} className='px-4 py-3 w-full   rounded-lg border border-slate-200 focus:outline-none'  />
      <input type="date" value={datet} onChange={(e)=>setDatet(e.target.value)} className='px-4 py-3 w-full  rounded-lg border border-slate-200 focus:outline-none'  />
      <button onClick={handlesubmit} className='px-4 py-3 w-full bg-(--accent)   rounded-lg text-(--secondary) cursor-pointer'>Submit</button>
      </div>
      <div className='w-full min-w-0 rounded-lg bg-(--secondary) shadow-md mt-6'>
       <div className='w-full overflow-x-auto'>
       <table className="w-full text-sm whitespace-nowrap">
<thead  className="bg-gray-50">
  <tr className='text-left'>
     <th className='px-4 py-3'>OrderNo</th>
     <th className='px-4 py-3'>order date</th>
     <th className='px-4 py-3'>Customer</th>
     <th className='px-4 py-3 text-center'>product details</th>
     <th className='px-4 py-3'>grand Total</th>
     <th className='px-4 py-3'>payment mode</th>
  </tr>
  </thead>   
  <tbody>
    {orders.length === 0?  (
    <tr>
       <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
        No orders found </td> 
    </tr>
    ):(
      orders.map((order)=>(
        <tr key={order._id} className="border-b last:border-b-0 border-b-slate-200">
      <td className='px-3 py-3'>{order.orderNumber}</td>
      <td className='px-3 py-3'>{order.createdAt}</td>
      <td className='px-3 py-3'>{order.customer_id.customerName}</td>
      <td className='px-3 py-3'>
     
  <table className="w-full  bg-slate-50 rounded-lg shadow-sm text-sm">
    <thead className="bg-gray-200">
      <tr>
        <th className="px-2 py-1">Image</th>
        <th className="px-2 py-1">Product</th>
        <th className="px-2 py-1">Price</th>
        <th className="px-2 py-1">Vendor</th>
        <th className=" px-2 py-1">Status</th>
      </tr>
    </thead>

    <tbody>
      {order?.items?.map((item) => (
        <tr key={item._id}>
          <td className="px-2 py-1">
            <img
              src={item?.product_id?.image || "https://via.placeholder.com/50"}
              alt={item?.productName}
              className="w-14 h-14"
            />
          </td>

          <td className=" px-2 py-1">{item?.productName}</td>
          <td className="px-2 py-1">₹{item?.price}</td>
          <td className=" px-2 py-1">{item?.vendor_id?.shopName}</td>
          <td className={`px-2 py-1 ${item?.orderStatus === "delivered"
                ? "text-green-600"
                : item?.orderStatus === "confirmed"
                ? "text-blue-600"
                : item?.orderStatus === "cancelled"
                ? "text-red-600"
                : "text-gray-500"}`}>{item?.orderStatus}</td>
        </tr>
      ))}
    </tbody>
  </table>


      </td>
      <td className='px-3 py-3'>{order.grandTotal
}</td>
      <td className='px-3 py-3'>{order.paymentMethod}</td>
      </tr>
      ))
    )}
    </tbody>  
    </table>
       </div>
       
      </div>
            <Pagination
        currentpage={pagec}
        totalpage={paginationcount.totalpages}
        onPageChange={setPagec}
      />
    </div>
  )
}

export default Orders





