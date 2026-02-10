import React, {useState,useEffect}from 'react'
import api from '../../../api'
import Pagination from '../../../components/common/pagination';

function Ordertrack() {
    const[datef,setDatef] = useState("");
    const[datet,setDatet]= useState("")
    const[orderstatus,setOrderstatus]=useState("pending")
    const[page,setPage] = useState(1);
    const limit =10;
    const[trackdet,setTrackdet] = useState([]);
    const[pagination,setPagination] = useState({
          totalpages:1,
          totalorders:0,
    })
    useEffect(()=>{
     const today = new Date().toISOString().split("T")[0];
     setDatef(today);
     setDatet(today);
    },[])
    ////////get ordertrack detsils
    const getordertrackdetails = async()=>{
        try{
const response = await api.get(`/customer/ordertrack?fdate=${datef}&tdate=${datet}&orderstatus=${orderstatus}&page=${page}&limit=${limit}`);
     setTrackdet(response.data.orders); 
     setPagination(response.data.pagination);  
}
       catch (error) {
      console.log("Error fetching orders:", error);
    }

    }
    /////submit button
    const handleSubmit = ()=>{
        getordertrackdetails();
    }
    return (
     <div className="p-4  md:p-6 w-full min-w-0 " >
      <div className='flex flex-col md:flex-row justify-center items-center gap-3' >
      <input type="date" value={datef} onChange={(e)=>setDatef(e.target.value)} className='px-4 py-3 w-full   rounded-lg border border-slate-200 focus:outline-none'  />
      <input type="date" value={datet} onChange={(e)=>setDatet(e.target.value)} className='px-4 py-3 w-full  rounded-lg border border-slate-200 focus:outline-none'  />
      <select onChange={(e)=>setOrderstatus(e.target.value)} className='px-4 py-3 w-full  rounded-lg border border-slate-200 focus:outline-none'  
      >
      <option value="pending">pending</option>
      <option value="confirmed">confirmed</option>
      <option value="shipped">shipped</option>
      <option value="delivered">delivered</option>
      <option value="cancelled">cancelled</option>
     
      </select>
      <button onClick={handleSubmit} className='px-4 py-3 w-full bg-(--accent)   rounded-lg text-(--secondary) cursor-pointer'>Submit</button>
      </div>
      <div className='w-full min-w-0 rounded-lg shadow-md mt-6'>
      <div className='w-full overflow-x-auto'>
     <table className='text-sm w-full whitespace-nowrap'>
   <thead  className="bg-gray-50">
    <tr>
         <th className='px-4 py-3'>OrderNo</th>
         <th className='px-4 py-3'>OrderDate</th>
            <th className='px-4 py-3'>Customer</th>
         <th className='px-4 py-3'>productdetails</th>
         <th className='px-4 py-3'>paymentMethod</th>

    </tr>
   </thead>
   <tbody>
   {trackdet.length===0?(
      <tr>
        <td colSpan={6} className="px-4 py-6 text-center text-gray-500"> No orders found</td>
      </tr>
   ):(
     trackdet.map((order)=>(
       <tr key={order._id} >
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
        <th className="px-2 py-1">category</th>
        <th className=" px-2 py-1">Status</th>
      </tr>
    </thead>

    <tbody>
       {order.orderitems.map((item) => (
        <tr key={item._id} >
          <td className="px-2 py-1">
            <img
              src={item?.product_id?.image || "https://via.placeholder.com/50"}
              alt={item?.productName}
              className="w-14 h-14"
            />
          </td>
        <td className=" px-2 py-1">{item?.productName}</td>
          <td className="px-2 py-1">₹{item?.price}</td>
          <td className=" px-2 py-1">{item?.category}</td>
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

        <td className='px-3 py-3'>{order.paymentMethod}</td>
       </tr>
     ))
    )}
    </tbody>
     </table>
      </div>
      </div>
             <Pagination
                    currentpage={page}
                    totalpage={pagination.totalpages}
                    onPageChange={setPage}
                  />
      
      </div>
  )}

export default Ordertrack