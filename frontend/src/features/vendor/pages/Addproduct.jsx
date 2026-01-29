import React,{useState } from 'react'
import api from '../../../api'

const category =[
   "Electronics",
  "Clothing",
  "Shoes",
  "Sports",
  "Books",
]
function Addproduct() {
 const [form,setForm] =useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
     discountPercent: "",
    stock: "",
    sku: "",
    isActive: true,
 });
 const [images,setImages] = useState([]);
 const [loading,setLoading]= useState(false);
 const [preview, setPreview] = useState(null);

 const handleChange =(e)=>{
  setForm((prev)=>({
    ...prev,[e.target.name] :e.target.value
  }))
}
const handleimageChange=(e)=>{
  const file = e.target.files[0];
  if(!file) return ;
  setImages(file);
  setPreview(URL.createObjectURL(file));
};
const handleSubmit = async(e)=>{
  e.preventDefault();
   const { name, description, category, price, stock, sku } = form;
    if (!name || !description || !category || !price || !stock || !sku) {
      alert("Please fill all required fields");
      return;
    }
  try{
  setLoading(true);
  const data = new FormData();
  Object.keys(form).forEach((key)=>data.append(key,form[key]));
  if(images){
    data.append("images", images);
  }
const response = await api.post("/vendor/addproduct",data);
console.log(response);
}
  catch(err){
         alert(err.response.data.message || "Error adding product");
  }
 finally {
      setLoading(false);
    }
};
  return (
    <div className=' bg-(--primary) p-4 sm:p-6 flex justify-center'>
      <div className='w-full max-w-4xl bg-(--secondary) rounded-2xl shadow-lg p-6 sm:p-8'>
      <h2 className='text-2xl sm:text-3xl font-bold text-(--text) mb-6'>Add new product</h2>
     <form  onSubmit={handleSubmit} className='space-y-4'>
      <input type="text" name ="name" value={form.name} onChange={handleChange} placeholder="product name" autoComplete='off' required className='w-full border border-slate-200  p-3 rounded-lg focus:outline-none' />
      <input type="text" name ="description"  value={form.description} onChange={handleChange} placeholder="description" autoComplete='off' required className='w-full border border-slate-200  p-3 rounded-lg focus:outline-none' />
     <select name="category" value={form.category} onChange={handleChange} className='w-full border border-slate-200  p-3 rounded-lg focus:outline-none' >
      <option value="" >Select Category</option>
    {category.map((cat)=>(
    <option value={cat}>{cat}</option>
    ))}
     </select>
 <input type="text" name ="brand" value={form.brand} onChange={handleChange} placeholder="brand" autoComplete='off' required className='w-full border border-slate-200  p-3 rounded-lg focus:outline-none' />
<div className='grid grid-col-1 sm:grid-cols-3 gap-4'>
<input type="number" name ="price" placeholder="price"  value={form.price} onChange={handleChange}  autoComplete='off' required className=' border border-slate-200  p-3 rounded-lg focus:outline-none' />
<input type="number" name ="discountPercent"  value={form.discountPercent} onChange={handleChange} placeholder="discount %" autoComplete='off' required className=' border border-slate-200  p-3 rounded-lg focus:outline-none' />
<input type="number" name ="stock" value={form.stock} onChange={handleChange}  placeholder="stock" autoComplete='off' required className='border border-slate-200  p-3 rounded-lg focus:outline-none' />
</div>
           <input type="text" name ="sku"  value={form.sku} onChange={handleChange}  placeholder="sku" autoComplete='off' required className='w-full border border-slate-200  p-3 rounded-lg focus:outline-none' />
<div>
  <label className='block mb-2 font-medium'>Product images</label>
<input type="file" accept="image/*" onChange={handleimageChange} className='cursor-pointer' />
 {preview && (
<div className='mt-3'>
  <img src={preview} alt="preview"  className='w-32 h-32 object-cover rounded-lg border border-slate-200'/>
</div>
 )}
</div>

<button type="submit"  disabled={loading} className="w-full bg-(--accent) text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
    {loading ? "Adding..." : "Add product"}
</button>
     </form>
      </div>
    </div>
  )
}

export default Addproduct