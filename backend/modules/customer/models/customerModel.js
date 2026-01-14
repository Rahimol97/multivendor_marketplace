import mongoose from 'mongoose'

const customerSchema =new mongoose.Schema(
    {
        user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        customerName:{type:String},
        mobile:{type:String},
        address:[{
            street:String,
            city:String,
            state:String,
            pincode:String
        }],
       
        isActive:{type:Boolean,default:true},
        lastLoginAt: {type: Date}
    },
  
    {timestamps:true}
  
)
export default mongoose.model("Customer",customerSchema)