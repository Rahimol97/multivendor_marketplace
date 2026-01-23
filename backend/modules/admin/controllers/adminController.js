import Customer from "../../customer/models/customerModel.js"
import Vendor from "../../vendor/models/vendorModel.js"
import User from "../models/adminModel.js"
import OrderItem from "../../vendor/models/orderItem.js"
import Commission from "../models/commissionModel.js"
import VendorCommission from "../models/vendorwiseCommissionModel.js"
export const getadminDashboardStats =async(req,res)=>{
    try{
       const customerCount  = await Customer.countDocuments({ isActive: true })
       const vendorCount = await Vendor.countDocuments({ status: "approved",isActive:true })
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
  const search = req.query.search || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page -1) * limit;
  //search query
  let searchcustomers = {};
  let  customerquery ={};
if(search.trim() !==""){
  const user =await User.find({
    $or:[
      {username :{$regex :search,$options:"i"}},
      { email: { $regex: search, $options: "i" } },
    ],
  }).select("_id");
  const userid = user.map((u)=>u._id);
     customerquery = {
        $or: [
          { customerName: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
          { user_id: { $in: userid } }
        ],
      };
}

///total customer count 
const totalcustomers = await Customer.countDocuments(customerquery);
 ///customer list
const customers = await Customer.find(customerquery).populate("user_id", "username email isActive").sort({ createdAt: -1 }).skip(skip).limit(limit);
  res.status(200).json({ success: true, customers,  pagination: {
        totalcustomers,
        page,
        limit,
        totalPages: Math.ceil(totalcustomers / limit),
      },});
}
  catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};
/////fetch all vendors list
export const getAllVendors= async(req,res)=>{
    try{
  const search = req.query.search || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
 const skip = (page-1) *limit;
 let searchvendors ={};
 let vendorquery = { status: "approved" };
 if(search.trim() !== ""){
   const user = await User.find({
    $or:[
      {username :{$regex :search,$options:"i"}},
      { email: { $regex: search, $options: "i" } },
    ],
  }).select("_id");
  const userid = user.map((u)=>u._id);
  vendorquery={
    $or:[
      {
        ShopName:{$regex :search,$options:"i"}
      },
          { mobile: { $regex: search, $options: "i" } },
          { user_id: { $in: userid } },
          
    ]
  }

 }
const totalvendors = await Vendor.countDocuments(vendorquery);
 ///vendor list
const vendors = await Vendor.find(vendorquery).populate("user_id", "username email isActive").sort({ createdAt: -1 }).skip(skip).limit(limit);
  res.status(200).json({ success: true, vendors,  pagination: {
        totalvendors,
        page,
        limit,
        totalPages: Math.ceil(totalvendors / limit),
      },});
}
      catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};
/////block  vendor/customer
export const blockUser = async(req,res)=>{
    try{
        const id = req.params.id;
        //customer find
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({success:false,message:"user not found"});
        }
        //toggle (block/unblock)
        const newstatus = !user.isActive;
const statusupdte = await User.findByIdAndUpdate(id,{ isActive: newstatus },
    { new: true });
    ///update customer
   await Customer.updateOne({ user_id: id },{$set:{isActive: newstatus}});
   await Vendor.updateOne({ user_id: id },{$set:{isActive: newstatus}});
   res.status(200).json({ success: true, message:  newstatus ? "User unblocked" : "User blocked", data: statusupdte });

}
      catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};



