import mongoose from 'mongoose'

const orderCommissionSchema  = new mongoose.Schema(
    {
    vendorId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "Vendor",
    required: true },
    amount: 
    {
    type: Number, 
    required: true
 },    
 commissionPercent: { type: Number, required: true },
 commissionAmount: { type: Number, required: true },
 vendorEarning: { type: Number, required: true },
 
    },
     { timestamps: true }

);
export default mongoose.model("OrderCommission",orderCommissionSchema);