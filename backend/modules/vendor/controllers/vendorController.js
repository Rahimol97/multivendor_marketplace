import Product from '../models/productsModel.js'
import Vendor from '../models/vendorModel.js'
import VendorOrder from '../models/venderwiseOrder.js'
import OrderItem from '../models/orderItem.js'

export const addProduct =async(req,res)=>{
    try{
     const {
    vendor_id,
      name,
      description,
      category,
      brand,
      price,
      discountPercent,
      stock,
      sku,
      isActive,
    } = req.body;

    //validation
  if (!vendor_id || !name || !description || !category || !price || !stock || !sku) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingsku = await Product.findOne({sku})
   if(existingsku){
     return res.status(400).json({
      success: false,
      message: "SKU already exists"
    });
   }

   const parsedprice = Number(price);
   const parseddiscount =  Number(discountPercent) ||0;
   const parsedstock = Number(stock);
   //calculate discounted price
 
   const discountedPrice = parsedprice - (parsedprice * parseddiscount) / 100;
     //  Get images from Cloudinary upload
    const images = req.files?.map(file => ({
      url: file.path,       // Cloudinary URL
      public_id: file.filename,
    })) || [];

//add product table
const product = await Product.create({
    vendor_id,
      name,
      description,
      category,
      brand,
      images,
      price:parsedprice,
      discountPercent: parseddiscount,
      discountedPrice,
      stock:parsedstock,
      sku,
      isActive: isActive ?? true, 
});
  return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
       });
}
 
    catch(error){
        res.status(500).json({message:"server error",error:error.message})
    }
};
//get all products
export const getAllproducts = async(req,res)=>{
    try{
   const products = await Product.find().populate("vendor_id","shopName email mobile").sort({ createdAt: -1});
   res.status(200).json({success:true,count:products.length,products})
    }
        catch(error){
        res.status(500).json({success:false,message:"server error",error:error.message})
    }

};
//get product by id
export const  getproductById = async(req,res)=>{
    try{
const {id} = req.params;
const products = await Product.findById(id).populate("vendor_id","shopName email mobile")
 if(!products){
  res.status(404).json({ success: false,message: "Product not found",})
  
 }

res.status(200).json({success:true,products})
}
    catch(error){
   res.status(500).json({success:false,message:"server error",error:error.message})
   
    }
};

///delete product

export const deleteProduct = async(req,res)=>{
    try{
  const {id} = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  res.status(200).json({
    success: true,
      message: "Product deleted successfully",
  })
}
    catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }
};
/////get products vendorwise
export const getvendorwiseProduct = async(req,res)=>{
    try{
     const {vendorId} =req.params;
     const products = await Product.find({vendor_id:vendorId}).sort({createdAt: -1,});
res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
    }
        catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }

};

//////update product

export const updateProduct = async(req,res)=>{
    try{
      const{id} = req.params;
      const product = await Product.findById(id);
      if(!product){
        res.status(404).json({success:false,message:"product not found"});
      }
          // Update fields
    product.vendor_id = req.body.vendor_id || product.vendor_id;
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.images = req.body.images || product.images;
    product.price = req.body.price ?? product.price;
    product.discountPercent = req.body.discountPercent ?? product.discountPercent;
    product.stock = req.body.stock ?? product.stock;
    product.sku = req.body.sku || product.sku;
    product.isActive = req.body.isActive ?? product.isActive;
    
/////calculate discounted price
    let discountedPrice = product.price;
    if (product.discountPercent > 0) {
      discountedPrice =
        product.price - (product.price * product.discountPercent) / 100;
    }
    product.discountedPrice = discountedPrice;

  await product.save();
  
 res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

}
       catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }

};

/////update vendor profile
export const updateVendorprofile = async(req,res)=>{
  try{
const userId = req.loggedUser._id;
const  updated = await Vendor.findOneAndUpdate({ user_id: userId },
    { $set: req.body },
    { new: true });
      res.status(200).json({ success: true, data: updated });
  }
  catch(error){
         res.status(500).json({message:"Server error", error: error.message});   
}
};
//////Get vendorwise customers orders list
export const getVendorwiseCustomerorder = async(req,res)=>{
try{
const userId = req.loggedUser._id;
const vendor = await Vendor.findOne({user_id:userId})
const orders = await VendorOrder.find({vendor_id:vendor._id}).populate("customer_id", "customerName mobile address")
.populate("items.product_id", "name price")
      .populate("order_id", "orderNumber paymentStatus status createdAt");

res.status(200).json({ success: true, data: orders });
}
  catch(error){
   res.status(500).json({message:"Server error", error: error.message});   
}
};
//////get vendor by id
export const getVendorbyId =async(req,res)=>{
    try{
    const userId = req.loggedUser._id;
    const vendor = await Vendor.findOne({user_id:userId});
    res.status(200).json({ success: true, data: vendor });
    }
    catch(error){
         res.status(500).json({message:"Server error", error: error.message});   
}
};

////////////////SALES REPORT 
 export const productWiseSalesReport = async(req,res)=>{
  try{
 const { from,to,vendor_id,category} = req.body;
 const match ={};
 if(from || to) match.createdAt ={};
 if(from) match.createdAt.$gte = new Date(from);
 if(to)  match.createdAt.$lte = new Date(to);

 if(vendor_id) match.vendor_id = new mongoose.Types.ObjectId(vendor_id);
if(category) match.category = category;
/////Delivered only for sales

match.orderStatus ="delivered";
const report = await OrderItem.aggregate([
  {$match:match},
  {
    $group:{
      _id:"$product_id",
       productName: { $first: "$productName" },
          category: { $first: "$category" },
          vendor_id: { $first: "$vendor_id" },
          qtySold: { $sum: "$quantity" },
          netSales: { $sum: "$total" },
    },
  },
 { $sort: { netSales: -1 } },
]);
 res.status(200).json({ success: true, report });

  }
 catch(error){
  res.status(500).json({message:"Server error", error: error.message});   
}
 
 };



