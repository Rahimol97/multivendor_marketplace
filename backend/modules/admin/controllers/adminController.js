import Customer from "../../customer/models/customerModel.js"
import Vendor from "../../vendor/models/vendorModel.js"
import User from "../models/adminModel.js"
import OrderItem from "../../vendor/models/orderItem.js"
import Commission from "../models/commissionModel.js"
import VendorCommission from "../models/vendorwiseCommissionModel.js"
export const getadminDashboardStats =async(req,res)=>{
    try{
       const customerCount  = await Customer.countDocuments({ isActive: true })
       const vendorCount = await Vendor.countDocuments({ status: "approved" })
       const pendingVendors= await Vendor.countDocuments({status:"pending"})
       const activeVendors =await Vendor.find({isActive:true,status:"approved"}).sort({ lastLoginAt: -1 }).limit(5).select("shopName vendorName lastLoginAt")
      //////today sales amount
      const start = new Date();
      start.setHours(0,0,0,0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const todaySales = await OrderItem.aggregate([
        {
            $match:{
                orderStatus : "delivered",
                orderedAt :{$gte:start,$lte:end},
            },
        },
        {
            $group:{
              _id:null,
              todaySalesAmount:{$sum:"$total"},
              todayOrders: { $sum: 1 },
              todayQuantity: { $sum: "$quantity" },
            },
        },
      ]);
      const todaySalesAmount = todaySales[0]?.todaySalesAmount || 0;
      const todayOrders = todaySales[0]?.todayOrders || 0;
    const todayQuantity = todaySales[0]?.todayQuantity || 0;
//////todayplatform earnings 
const globalCommissionDoc = await Commission.findOne();
const globalCommission = globalCommissionDoc?.globalCommissionPercentage || 0;
const todayPlatform = await OrderItem.aggregate([
    {
        $match:{
            orderStatus:"delivered",
            orderedAt:{$gte:start,$lte:end},
        },
    },
    //vendor commission
    {
        $lookup:{
         from: "vendorcommissions",
         localField: "vendor_id",
         foreignField: "vendor_id",
         as: "vendorCommission",
        },
    },
    {
       $addFields: {
      commissionPercentage: {
        $ifNull: [
          { $arrayElemAt: ["$vendorCommission.commission", 0] },
          globalCommission, // fallback
        ],
      },
    }, 
    },
   ///platform earning for each item
    {
        $addFields: {
      platformEarning: {
        $divide: [
          { $multiply: ["$total", "$commissionPercentage"] },
          100,
        ],
      },
    },
    },
    //////vendor payout
    {
  $addFields: {
    vendorPayout: { $subtract: ["$total", "$platformEarning"] }
  }
},
    //total platform earning for today
     {
    $group: {
      _id: null,
      todayPlatformEarnings: { $sum: "$platformEarning" },
    todayVendorPayout: { $sum: "$vendorPayout" },
    },
  },
]);
const todayPlatformEarnings = todayPlatform[0]?.todayPlatformEarnings || 0;
const todayVendorPayout = todayPlatform[0]?.todayVendorPayout || 0;
       res.status(201).json({success:true,data:{customerCount,vendorCount,pendingVendors,activeVendors, todaySalesAmount, todayOrders,  todayQuantity,todayPlatformEarnings,todayVendorPayout}})
    
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}
////pending approvals
export const pendingApprovals = async(req,res)=>{
    try{
       const pendings = await Vendor.find({status:"pending"});
       res.status(201).json({success:true,pendings})
    }
    catch(error){
    res.status(500).json({message:error.message})
  
    }
}

export const updateVendorStatus =async(req,res)=>{
    try{
      const {id}  =req.params;
      const{status} = req.body;
      if(!["approved", "rejected"].includes(status)){
       return res.status(400).json({success:true,message:"invalid status"});
      }
const vendor = await Vendor.findByIdAndUpdate(id,{status,isActive: status === "approved"}, { new: true });
   if(!vendor){
    return res.status(404).json({
      success: true,
      message: "vendor not found",
    });
 
   }
      return res.status(201).json({
      success: true,
      message: "successdully",
      data:vendor
    });
}
     catch(error){
    res.status(500).json({success: false,message:error.message});
    }
};
////fetch all customers list
export const getAllCustomers =async(req,res)=>{
    try{
  const customers = await Customer.find().populate("user_id","username customerName  mobile address email role isActive createdAt");
  res.status(200).json({ success: true, data: customers});
}
  catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};
/////fetch all vendors list
export const getAllVendors= async(req,res)=>{
    try{
const vendors =await Vendor.find().populate("user_id","username email role isActive createdAt");
  res.status(200).json({ success: true, data: vendors});    
}
      catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};
/////block  vendor/customer
export const blockUser = async(req,res)=>{
    try{
        const {id} = req.params;
const user = await User.findByIdAndUpdate(id,{ isActive: false },
    { new: true });
   await Customer.updateOne({ user_id: id },{$set:{isActive: false}});
   await Vendor.updateOne({ user_id: id },{$set:{isActive: false}});
   res.status(200).json({ success: true, message: "User blocked", data: user });

}
      catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};
////unblock user
export const unblockUser = async(req,res)=>{
    try{
   const {id} =req.params;
const user = await User.findByIdAndUpdate(id,{ isActive: true },
    { new: true });
       await Customer.updateOne({ user_id: id },{$set:{isActive: true}});
   await Vendor.updateOne({ user_id: id },{$set:{isActive: true}});
   res.status(200).json({ success: true, message: "User unblocked", data: user });
    }
     catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};


