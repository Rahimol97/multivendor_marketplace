import mongoose from 'mongoose'

const oderSchema = new mongoose.Schema(
    {
   orderNumber :{
    type:String,unique:true,required:true
   },
   user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   customer_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Customer",
     required: true,
   },
   totalItems:Number,
   subTotal:Number,
   tax:Number,
   discount:Number,
   grandTotal:Number,

   paymentMethod:{
    type:String,
    enum:["cash", "card", "upi", "netbanking"],
    required: true,
   },
  paymentStatus:{
    type:String,
    enum:["pending", "paid", "failed"],
    required:true
  },
   orderStatus:{
    type:String,
    enum:["placed", "partially_confirmed", "completed", "cancelled"],
    required:true
   },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
},
  { timestamps: true }

);
export default mongoose.model("Order",oderSchema);