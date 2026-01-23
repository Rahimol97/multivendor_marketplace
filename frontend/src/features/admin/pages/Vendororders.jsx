import React,{useState,useEffect} from 'react'

function Vendororders() {
      const [datef,setDatef] = useState("")
      const [datet,setDatet] = useState("")
      const [orders,setOrders] = useState([]);
      const[pagec,setPagec] = useState(1);
        useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setDatef(today);
        setDatet(today);
        }, [])
      
  return (
     <div className="p-4  md:p-6 w-full min-w-0 " >
      <div className='flex flex-col md:flex-row justify-center items-center gap-3' >
      <input type="date" value={datef} onChange={(e)=>setDatef(e.target.value)} className='px-4 py-3 w-full   rounded-lg border border-slate-200 focus:outline-none'  />
      <input type="date" value={datet} onChange={(e)=>setDatet(e.target.value)} className='px-4 py-3 w-full  rounded-lg border border-slate-200 focus:outline-none'  />
      <select  className='px-4 py-3 w-full  rounded-lg border border-slate-200 focus:outline-none'  
      >
        <option value="">select vendor</option>
        <option value="">select vendor</option>
      </select>
      <button  className='px-4 py-3 w-full bg-(--accent)   rounded-lg text-(--secondary) cursor-pointer'>Submit</button>
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
     </table>
      </div>
      </div>
      </div>
  )
}

export default Vendororders