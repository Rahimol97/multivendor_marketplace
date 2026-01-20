import Commission from '../models/commissionModel.js'
import VendorCommission from '../models/vendorwiseCommissionModel.js'
import Vendor from '../../vendor/models/vendorModel.js'
import OrderItem from '../../vendor/models/orderItem.js';

export const setGlobalCommission = async(req,res)=>{
    try{
   const {globalCommissionPercentage } = req.body;
   if(globalCommissionPercentage<0 || globalCommissionPercentage>100){
    return res.status(400).json({
        success:true,
        message :"commission must be between 0 and 100"
    });
   }
   const commission = await Commission.findOne();
   const updated = commission ? await Commission.findByIdAndUpdate(commission._id,{globalCommissionPercentage},{new:true}):
   await Commission.create({globalCommissionPercentage});
   res.status(201).json({message:"global commission updated",updated})
}
 catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/////api to get existing commisson
export const getcommisssion = async(req,res)=>{
    try{
   const commission= await Commission.findOne();
   res.status(200).json({
    success:true,
    globalCommission:commission?.globalCommissionPercentage || 0,
   });
    }
     catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//////vendorwise update commission
export  const vendorCommisson = async(req,res)=>{
    try{
        const {vendorId}=req.params;
        const {commission} = req.body;
         if (commission < 0 || commission > 100) {
      return res.status(400).json({
        success: false,
        message: "Commission must be between 0 and 100",
      });
    }

        const vendor = await VendorCommission.findOneAndUpdate(
            {vendor_id:vendorId},
            {commission},
            {new:true,  upsert: true }
       );
        if (!vendor)
            { 
                return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(201).json({ message: "Vendor commission updated", vendor });
}
     catch (err) {
    res.status(500).json({ message: err.message });
  }

};

//////vendor-wise commission report 
export const vendorCommissionReport = async(req,res)=>{
    try{
const globalDoc =await Commission.findOne();
const globalCommission = globalDoc?.globalCommissionPercentage||0;
//vendor override
const vendorCommissionDocs = await VendorCommission.find();
const vendorCommissionMap = new Map(
    vendorCommissionDocs.map((x)=>[String(x.vendor_id), x.commission])
);
///delvered total vendors
const totals = await OrderItem.aggregate([
      { $match: { orderStatus: "delivered" } },
      {
        $group: {
          _id: "$vendor_id",
          completedAmount: { $sum: "$total" },
        },
      },
    ]);
  const final = await Promise.all(
      totals.map(async (t) => {
        const vendor = await Vendor.findById(t._id).select("vendorName shopName");

        const vendorName =
          vendor?.vendorName || vendor?.shopName || "Unknown Vendor";

        const vendorCommission = vendorCommissionMap.get(String(t._id)) ?? null;

        const effectiveCommission =
          vendorCommission !== null ? vendorCommission : globalCommission;

        const platformShare = Math.round(
          (t.completedAmount * effectiveCommission) / 100
        );

        return {
          vendorId: t._id,
          vendorName,
          completedAmount: t.completedAmount,
          vendorCommission, // null or number
          effectiveCommission, // ✅ textbox should show this
          platformShare,
        };
      })
    );

    res.status(200).json({
      success: true,
      globalCommission,
      final,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};