import Cart from "../models/customerCart.js"
import Product from "../../vendor/models/productsModel.js"

////calculate total
const calculateTotals = (cart)=>{
    cart.subTotal = cart.items.reduce((acc,item)=>acc + item.total, 0);
//////tax 5%
cart.tax = cart.subTotal * 0.05;
cart.grandTotal = cart.subTotal + cart.tax - cart.discount;
};
///add to cart
export const addtoCart = async(req,res)=>{
    try{
    const {user_id,customer_id,vendor_id,product_id,quantity} = req.body; 
    if(!user_id || !customer_id || !vendor_id|| !product_id || !quantity)
    {
        res.status(400).json({ message: "All fields are required"});
    }
   const product = await Product.findById(product_id);
   if(!product) {
    return res.status(404).json({message:"product not found"});
   }
   const price =product.price;
   const productName = product.name;
   ///if no cart,create new
   let cart = await Cart.findOne({user_id});

   if(!cart){
    cart=new Cart({
       user_id,
        customer_id,
        items: [
          {
            vendor_id,
            product_id,
            productName,
            quantity,
            price,
            total: quantity * price,
          },
        ],
      });   

calculateTotals(cart);
await cart.save();
return res.status(201).json({message:"Cart created & item added", cart })
}
//check item already exists in the cart
const itemIndex = cart.items.findIndex(
    (item)=>item.product_id.toString()===product_id.toString()
);

if(itemIndex> -1){
 // product exists → increase quantity
 cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].total =
        cart.items[itemIndex].quantity * cart.items[itemIndex].price;
    
}
else{
   // new product push
      cart.items.push({
        vendor_id,
        product_id,
        productName,
        quantity,
        price,
        total: quantity * price,
      }); 
}
   calculateTotals(cart);
    await cart.save();

    return res.status(200).json({ message: "Item added to cart", cart });
 
}
    catch(error){
        res.status(500).json({messsge:"server error",error:error.message});
    }
};

/////get cart by user
export const getcartbyUser = async(req,res)=>{
    try{
   const {userId} = req.params;
   const cart = await Cart.findOne({user_id:userId}).populate("user_id").populate("customer_id") .populate("items.vendor_id")
      .populate("items.product_id");
      if(!cart){
        return res.status(404).json({message:"cart not found"});
      }
    return res.status(200).json({ cart });
    }
        catch(error){
        res.status(500).json({messsge:"server error",error:error.message});
    }

};
////update quantity
export const updateCartItemQty =async(req,res)=>{
    try{
    const {user_id, product_id, quantity } =req.body;
    const cart = await Cart.findOne({user_id});
    if(!cart) {
        return res.status(404).json({message:"cart not found"});
    }
    const item = cart.items.find((i)=>i.product_id.toString()=== product_id.toString());
    if(!item){
        return res.status(404).json({message:"itemnot found in the cart"});
    }
    item.quantity = quantity;
    item.total = item.quantity * item.price;
    calculateTotals(cart);
    await cart.save();
     return res.status(200).json({ message: "Quantity updated", cart });
 
 }
     catch(error){
        res.status(500).json({messsge:"server error",error:error.message});
    }

};

//////remove sigle iten from the cart
export const removecartItem = async(req,res)=>{
    try{
     const {user_id,product_id} = req.params;
     const cart = await Cart.findOne({user_id});
     if(!cart){
        return res.status(404).json({message:"cart  not found"})
     }
     cart.items = cart.items.filter((i)=>i.product_id.toString()!==product_id.toString());
     calculateTotals(cart);
    await cart.save();

    return res.status(200).json({ message: "Item removed", cart });
  
    }
     catch(error){
        res.status(500).json({messsge:"server error",error:error.message});
    }

};
////clr cart
export const clearCart = async(req,res)=>{
    try{
      const {userId} =req.params;
      const cart = await Cart.findOne({user_id:userId });
      if(!cart){
        return res.status(404).json({message:"cart not found"});
      }
      cart.items = [];
    cart.subTotal = 0;
    cart.tax = 0;
    cart.discount = 0;
    cart.grandTotal = 0;
     await cart.save();
     return res.status(200).json({message:"cart cleared",cart});
    }
         catch(error){
        res.status(500).json({messsge:"server error",error:error.message});
    }

}


