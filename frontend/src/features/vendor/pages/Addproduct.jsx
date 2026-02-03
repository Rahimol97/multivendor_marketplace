import React,{useState,useEffect } from 'react'
import api from '../../../api'
import Toast from '../../../components/common/Toast'
import { useParams, useNavigate } from 'react-router-dom'


function Addproduct() {
const { id } = useParams(); // product id if editing
const navigate = useNavigate();
const isEditMode = Boolean(id);
const[category,setCategory] = useState([]);
 const [form,setForm] =useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    discountPercent: "",
    stock: "",
    minStock: "",
    sku: "",
    isActive: true,
 });
 const [images,setImages] = useState(null);
 const [loading,setLoading]= useState(false);
 const [preview, setPreview] = useState(null);
const [toast, setToast] = useState({ message: "", type: "success" });
 const handleChange =(e)=>{
  setForm((prev)=>({
    ...prev,[e.target.name] :e.target.value
  }))
}
const showToast = (message,type="success")=>{
  setToast({ message, type });
};
const handleimageChange=(e)=>{
  const file = e.target.files[0];
  if(!file) return ;
  setImages(file);
  setPreview(URL.createObjectURL(file));
};
const handleSubmit = async(e)=>{
  e.preventDefault();
   const { name, description, category, price, stock,  sku, minStock } = form;
    if (!name || !description || !category || !price || !stock || !sku || !minStock) {
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

  if(isEditMode){
    await api.put(`/vendor/editproduct/${id}`, data);
      showToast("Product updated successfully!", "success");
    navigate("/vendor/productlist"); 

    }else{
 await api.post("/vendor/addproduct",data);
showToast("Product added successfully!",  "success" );
  }
setForm({
      name: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      discountPercent: "",
      stock: "",
      minStock: "",
      sku: "",
      isActive: true,
    });

    // Reset image & preview
    setImages(null);
    setPreview(null);

}
  catch(err){
 showToast(
      err.response.data.message,
     "error",
    );  }
 finally {
      setLoading(false);
    }
};
const fetchcategories =async()=>{
 const response = await api.get("/admin/getactivecategories")
console.log(response.data);
setCategory(response.data)
}
/////////fetch data when editing
useEffect(()=>{
  fetchcategories();
   if (!isEditMode) return;
    const fetchProduct = async () => {
    try {
      const res = await api.get(`/vendor/${id}`); // your get by id route
      const p = res.data.products;

      setForm({
        name: p.name || "",
        description: p.description || "",
        category: p.category || "",
        brand: p.brand || "",
        price: p.price || "",
        discountPercent: p.discountPercent || "",
        stock: p.stock || "",
        minStock: p.minStock || "",
        sku: p.sku || "",
        isActive: p.isActive ?? true,
      });

      if (p.images?.length > 0) {
        setPreview(p.images[0].url); // show existing image
      }
    } catch (err) {
      showToast("Failed to load product", "error");
    }
  };

  fetchProduct();
}, [id]);

  return (
    <div className=' bg-(--primary) p-4 sm:p-6 flex justify-center'>
      <div className='w-full max-w-4xl bg-(--secondary) rounded-2xl shadow-lg p-6 sm:p-8'>
      <h2 className='text-2xl sm:text-3xl font-bold text-(--text) mb-6'>{ isEditMode ? "Edit Product" :"Add new product"}</h2>
     <form  onSubmit={handleSubmit} className='space-y-4'>
      <input type="text" name ="name" value={form.name} onChange={handleChange} placeholder="product name" autoComplete='off' required className='w-full border border-slate-200  p-3 rounded-lg focus:outline-none' />
      <input type="text" name ="description"  value={form.description} onChange={handleChange} placeholder="description" autoComplete='off' required className='w-full border border-slate-200  p-3 rounded-lg focus:outline-none' />
     <select name="category" value={form.category} onChange={handleChange} className='w-full border border-slate-200  p-3 rounded-lg focus:outline-none' >
      <option value="" >Select Category</option>
    {category.map((cat,index)=>(
    <option value={cat.name}>{cat.name}</option>
    ))}
     </select>
 <input type="text" name ="brand" value={form.brand} onChange={handleChange} placeholder="brand" autoComplete='off' required className='w-full border border-slate-200  p-3 rounded-lg focus:outline-none' />
<div className='grid grid-col-1 sm:grid-cols-3 gap-4'>
<input type="number" name ="price" placeholder="price"  value={form.price} onChange={handleChange}  autoComplete='off' required className=' border border-slate-200  p-3 rounded-lg focus:outline-none' />
<input type="number" name ="discountPercent"  value={form.discountPercent} onChange={handleChange} placeholder="discount %" autoComplete='off' required className=' border border-slate-200  p-3 rounded-lg focus:outline-none' />
<input type="number" name ="stock" value={form.stock} onChange={handleChange}  placeholder="stock" autoComplete='off' required className='border border-slate-200  p-3 rounded-lg focus:outline-none' />

</div>
<input type="number" name="minStock" value={form.minStock} onChange={handleChange} placeholder="min stock alert" required className='w-full border border-slate-200  p-3 rounded-lg focus:outline-none' />

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
    {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Product" : "Add Product")}
</button>
     </form>
      </div>
      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default Addproduct