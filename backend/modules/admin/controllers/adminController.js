import Customer from "../../customer/models/customerModel.js"
import Vendor from "../../vendor/models/vendorModel.js"
import User from "../models/adminModel.js"
import OrderItem from "../../vendor/models/orderItem.js"
import Commission from "../models/commissionModel.js"
import VendorCommission from "../models/vendorwiseCommissionModel.js"
import Category from "../models/categoryModel.js"
import ContactMessage from "../../customer/models/contactModel.js";


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
////////get all vendors
export const getvendorslist = async(req,res)=>{
  try{
  const vendors = await Vendor.find({status:"approved"}).select("_id user_id shopName");
  res.status(200).json({ success: true, vendors });
}
    catch(error){
    res.status(500).json({success: false,message:error.message});  
    }

}



//////////category section 
export const addcategory = async(req,res)=>{
  try {
    const { name } = req.body;

    const category = await Category.create({
      name,
      imageUrl: req.file.path, // Cloudinary URL
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/////get all categories
export const getcategories =async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json(categories);
};
/////get active categories
export const getactivecategories =async (req, res) => {
  const categories = await Category.find({isBlocked:false}).sort({ createdAt: -1 });
  res.status(200).json(categories);
};
///////edit categories
export const updatecategory = async (req, res) => {
  try {
    const {id} =req.params;
    const { name } = req.body;
    let updateData = { name };
  
if (req.file) {
  updateData.imageUrl = req.file.path;
}
 const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
   res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const blockunblockcat = async (req, res) => {
  const category = await Category.findById(req.params.id);
  category.isBlocked = !category.isBlocked;
  await category.save();
  res.json(category);
};
///////getcontactmessages

export const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// mark as read
export const markAsRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
};

// deletemessages
export const deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting message" });
  }
};

///unread messages
export const getUnreadCount = async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments({ status: "new" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Error getting count" });
  }
};
