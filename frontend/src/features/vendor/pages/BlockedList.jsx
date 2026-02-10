import React,{useState,useEffect} from 'react'
import api from '../../../api'
import Pagination from '../../../components/common/pagination';
import Toast from '../../../components/common/Toast';
import FormatDate from '../../../components/common/Formatdatetime'

function BlockedList() {
   const [page,setPage] = useState(1);
   const [products,setProducts] = useState([]);
   const [search,setSearch] =useState("");
     const [paginationcount,setPaginationcount] = useState({
       totalpages:1,
       totalproducts:0,
     });
     const [toast, setToast] = useState({id: 0, message: "", type: "success" });
     
     const limit =10;
useEffect(()=>{
  getblockedproducts();
},[page, search]);

const showToast = (message,type="success")=>{
  setToast({  id: Date.now(), message, type });
};
/////blocked  products
  const getblockedproducts = async()=>{
      try{
const response = await api.get(`/vendor/vendorwiseblocked?search=${search}&page=${page}&limit=${limit}`)
    setProducts(response.data.products) ;
    setPaginationcount(response.data.pagination);
}
       catch (err) {
        console.log(err.response.data)
       }
     };
/////unblock product
const handleunBlock  = async(id)=>{
try{
const response = await api.patch(`/vendor/unblockproduct/${id}`);
showToast("Product unblocked",  "success" );
setProducts((prev)=>prev.filter((product)=>product._id !== id));
}
catch(err)
{
showToast(err.response.data.message, "success" );

}
}
  return (
        <div className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>Blocked products</h2>
    <div className='flex flex-col sm:flex-row gap-3 mb-4'>
      <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by name, brand, SKU" className='border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--accent) rounded-md md:w-1/2 w-full'/>   
  
    </div>
    <div className='w-full min-w-0 rounded-lg shadow-md mt-6'>
           <div className='w-full overflow-x-auto'>
 <table className='text-sm w-full whitespace-nowrap'>
   <thead  className="bg-gray-100">
    <tr>
         <th className='px-4 py-3'>Product</th>
         <th className='px-4 py-3'>category</th>
            <th className='px-4 py-3'>brad</th>
         <th className='px-4 py-3'>price</th>
         <th className='px-4 py-3'>stock</th>
         <th className='px-4 py-3'>SKU</th>
         <th className='px-4 py-3'>created At</th>
         <th className='px-4 py-3'>unblock</th>

    </tr>
   </thead>
    <tbody>
    
       {products.map((prod)=>(
            <tr key={prod._id} className='border-b text-center border-b-slate-200 last:border-b-0'>
           <td className='px-3 py-3 '>
             <div className="flex items-center justify-center gap-3">
       {prod.images?.[0]?.url && (
         <img
           src={prod.images[0].url}
           alt={prod.name}
           className="w-12 h-12 object-cover rounded-md border border-gray-200 shrink-0"
         />
       )}
       <span className="font-medium text-gray-800">{prod.name}</span>
     </div>
          </td>
           <td className='px-3 py-3'>{prod.category}</td>
           <td className='px-3 py-3'>{prod.brand}</td>
           <td className='px-3 py-3'>{prod.price}</td>
           <td className='px-3 py-3'>{prod.stock}</td>
           <td className='px-3 py-3'>{prod.sku}</td>
           <td className='px-3 py-3'><FormatDate date={prod.createdAt} /></td>
   
           <td className='px-3 py-3 text-center space-x-2'>
            
                     <button
                       onClick={() => handleunBlock(prod._id)}
                       className="bg-red-700 cursor-pointer text-white px-3 py-1 rounded-md"
                     >
                       Unblock
                     </button>
           </td>
          </tr>
       ))}
        
      
       </tbody>
     </table>
   
 
   </div>
    </div>
            <Pagination
            currentpage={page}
            totalpage={paginationcount.totalpages}
            onPageChange={setPage}
          />
               {toast.message && <Toast  key={toast.id} message={toast.message} type={toast.type} />}
    
    
    </div>
  )
}

export default BlockedList