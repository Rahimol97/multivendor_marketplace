import Order  from '../models/customerOrderModel.js'
import VendorOrder from '../../vendor/models/venderwiseOrder.js'
import Product from '../../vendor/models/productsModel.js'
import Customer from '../models/customerModel.js'
import OrderItem from '../../vendor/models/orderItem.js'
import mongoose from 'mongoose'
import orderItem from '../../vendor/models/orderItem.js'

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user_id = req.loggedUser._id; // auth middleware

    const {
      customer_id,
      items, // [{ product_id, quantity }]
      paymentMethod,
      paymentStatus,
      deliveryAddress,
      tax = 0,
      discount = 0,
    } = req.body;

    if (!customer_id || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "customer_id and items required",
      });
    }

    // ✅ get product details
    const productIDs = items.map((i) => i.product_id);

    const products = await Product.find({ _id: { $in: productIDs } }).session(
      session
    );

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: "Some products not found",
      });
    }

    // ✅ Create allItems with price + vendor_id
    const allItems = items.map((i) => {
      const product = products.find(
        (p) => p._id.toString() === i.product_id.toString()
      );

      const price =
        product.discountedPrice > 0 ? product.discountedPrice : product.price;

      return {
        product_id: product._id,
        vendor_id: product.vendor_id,
        quantity: i.quantity,
        price,
        total: price * i.quantity,

        productName: product.name,
        category: product.category,
        sku: product.sku,
      };
    });

    const subTotal = allItems.reduce((sum, i) => sum + i.total, 0);
    const grandTotal = subTotal + tax - discount;

    // ✅ Create main Order
    const order = await Order.create(
      [
        {
          orderNumber: "ORD-" + Date.now(),
          user_id,
          customer_id,
          totalItems: allItems.reduce((sum, i) => sum + i.quantity, 0),
          subTotal,
          tax,
          discount,
          grandTotal,
          paymentMethod,
          paymentStatus,
          orderStatus: "placed",
          deliveryAddress,
        },
      ],
      { session }
    );

    const createdOrder = order[0];

    // ✅ Split vendor wise
    const vendorWise = {};
    allItems.forEach((item) => {
      const vendorId = item.vendor_id.toString();
      if (!vendorWise[vendorId]) vendorWise[vendorId] = [];

      vendorWise[vendorId].push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        productName: item.productName,
        category: item.category,
        sku: item.sku,
      });
    });

    // ✅ Create VendorOrders + OrderItems
    const vendorOrders = await Promise.all(
      Object.keys(vendorWise).map(async (vendorId) => {
        const vendorItems = vendorWise[vendorId];
        const vendorSubTotal = vendorItems.reduce((sum, i) => sum + i.total, 0);

        // ✅ VendorOrder
        const vendorOrder = await VendorOrder.create(
          [
            {
              order_id: createdOrder._id,
              vendor_id: vendorId,
              customer_id,
              items: vendorItems.map((i) => ({
                product_id: i.product_id,
                quantity: i.quantity,
                price: i.price,
                total: i.total,
              })),
              subTotal: vendorSubTotal,
              vendorEarning: vendorSubTotal * 0.9,
              platformCommisson: vendorSubTotal * 0.1,
              vendorPaymentStatus: "pending",
              orderStatus: "pending",
            },
          ],
          { session }
        );

        const createdVendorOrder = vendorOrder[0];

        // ✅ OrderItems
        const orderItemsDocs = vendorItems.map((i) => ({
          order_id: createdOrder._id,
          vendorOrder_id: createdVendorOrder._id,
          customer_id,
          vendor_id: vendorId,
          product_id: i.product_id,

          productName: i.productName,
          category: i.category,
          sku: i.sku,

          quantity: i.quantity,
          price: i.price,
          total: i.total,

          orderStatus: createdVendorOrder.orderStatus,
          orderedAt: createdOrder.createdAt,
        }));

        await OrderItem.insertMany(orderItemsDocs, { session });

        return createdVendorOrder;
      })
    );

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: createdOrder,
      vendorOrders,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



//fetch all main orders
export const getallOrders = async(req,res)=>{
    try{
const {fdate,tdate,page,limit} = req.query;
let filter ={};
if(fdate && tdate){
  const start = new Date(fdate);
  const end    = new Date(tdate);
  end.setHours(23, 59, 59, 999);
  filter.createdAt ={$gte : start,$lte:end};

}
const skip = (page - 1) *limit;
const totalorders = await Order.countDocuments(filter);
const orders = await Order.find(filter)
.populate("user_id" , "username").populate("customer_id","customerName")
.sort({createdAt:-1}).skip(skip).limit(limit).lean();

const orderids = orders.map((ids)=>ids._id);
 const orderitems = await OrderItem.find({order_id:{$in:orderids}}).populate("product_id", "name price sku").populate("vendor_id","shopName").lean();
const orderwithitems = await orders.map((order)=>{
  return {
    ...order,items:orderitems.filter((item)=>item.order_id.toString()===order._id.toString()),
  };
});
 res.status(200).json({message:"Orders fetched successfully",
   orders:orderwithitems,
  pagination:{
    totalorders,
    totalpages:Math.ceil(totalorders/limit),
    currentpage:page,
    limit
  },
  
  });
}
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message })
    }
};
//get order with vendor order
export const getvendororders = async(req,res)=>{
    try{
        const {fdate,tdate,vendorid,page,limit} =req.query;

         let orderfilter={};
         let itemfilter ={};
         if(fdate && tdate){
          const start = new Date(fdate);
          const end = new Date(tdate);
          end.setHours(23,59,59,999);
          orderfilter.createdAt={$gte:start,$lte:end};
         }
         if(vendorid){
          itemfilter.vendor_id = vendorid;
         }
         const skip =(page-1)*limit;
         //get orders date wise
         const orders = await Order.find(orderfilter).populate("customer_id","customerName").sort({createdAt:-1}).skip(skip).limit(limit).lean();
         const orderids = orders.map((order)=>order._id);
          //get order items vendor wise
          const orderitems  = await OrderItem.find({order_id:{$in:orderids},...itemfilter})
          .populate("product_id","name price sku").lean();
      
          const orderwithitems= [];
          for(const order of orders){
            const items = orderitems.filter((item)=>item.order_id.toString()===order._id.toString());
            if(items.length>0){
              orderwithitems.push({
                ...order,
                orderitems:items,
              });
            }
          }
            const totalorders = orderwithitems.length;
   res.status(200).json({message:"Orders fetched successfully",
   orders:orderwithitems,
  pagination:{
    totalorders,
    totalpages:Math.ceil(totalorders/limit),
  },
  
  });

          
        }   
    catch(error){
        res.status(500).json({message:"Server error", error: error.message})
    }
};
///////////orderwisetracking
export const getorderwisetrack = async(req,res)=>{
  try{
 const{fdate,tdate,orderstatus,page,limit} =req.query;
 const orderfilter ={};
 const itemfilter ={};
 if(fdate && tdate){
  const start = new Date(fdate);
  const end = new Date(tdate);
  end.setHours(23,59,59,999);
  orderfilter.createdAt={$gte:start,$lte:end};
 }
 if(orderstatus){
  itemfilter.orderStatus = orderstatus;
 }
 const skip = (page-1)*limit;
 const orders = await Order.find(orderfilter).populate("customer_id","customerName").sort({createdAt:-1}).skip(skip).limit(limit).lean();
 const orderids =orders.map((order)=>order._id);
 const orderitems=await OrderItem.find({order_id:{$in:orderids},...itemfilter})
 .populate("product_id", "name price sku").lean();
const orderwithitems =[];
for(const order of orders){
  const items = await orderitems.filter((item)=>item.order_id.toString()===order._id.toString())
  if(items.length>0){
              orderwithitems.push({
                ...order,
                orderitems:items,
              });
            }
}
   const totalorders = orderwithitems.length;
   res.status(200).json({message:"Orders fetched successfully",
   orders:orderwithitems,
  pagination:{
    totalorders,
    totalpages:Math.ceil(totalorders/limit),
  },
  
  });


  }
  catch(error){
  res.status(500).json({message:"Server error", error: error.message})
    }

}


///delete orders
export const deleteOrders = async(req,res)=>{
try{
const{id} = req.params;
const order = await Order.findById(id);
if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
//delete main order
await Order.findByIdAndDelete(id);
//vendor order llinked to this order
await VendorOrder.deleteMany({order_id:id});
await OrderItem.deleteMany({order_id:id});
res.status(200).json({message:"order deleted successfully"});
}
catch(error){
         res.status(500).json({message:"Server error", error: error.message})
   
}
};
//////customer profile update
export const updateCustomerprofile =async(req,res)=>{
    try{
    const userId = req.loggedUser._id;
    const updated = await Customer.findOneAndUpdate({user_id:userId},{ $set: req.body },
    { new: true });
    res.status(200).json({ success: true, data: updated });
    }
    catch(error){
         res.status(500).json({message:"Server error", error: error.message});   
}
};
////get customer details by id
export const getCustomerbyId =async(req,res)=>{
    try{
    const userId = req.loggedUser._id;
    const customer = await Customer.findOne({user_id:userId});
    res.status(200).json({ success: true, data: customer });
    }
    catch(error){
         res.status(500).json({message:"Server error", error: error.message});   
}
}

/////TODAYS ORDERS
export const getTodayOrderlist = async(req,res)=>{
  try{
const start = new Date();
start.setHours(0,0,0,0);
const end = new Date();
end.setHours(23, 59, 59, 999);
const todayOrders = await OrderItem.find({
  orderedAt:{$gte:start,$lte:end},
}).populate("order_id","orderNumber paymentStatus orderStatus grandTotal")
.populate("customer_id","customerName")
.populate("vendor_id","vendorName shopName")
.populate("product_id","name images price discountedPrice ").sort({orderedAt:-1});

return res.status(200).json({
       success: true,  
      final: todayOrders

    })
}
      catch(error){
         res.status(500).json({message:"Server error", error: error.message});   
}

};