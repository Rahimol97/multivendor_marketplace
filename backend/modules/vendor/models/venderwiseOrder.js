import mongoose from 'mongoose'

const vendorOrderSchema = new mongoose.Schema(
    {
        order_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order",
            required:true
        },
        vendor_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Vendor",
            required:true
        },
          customer_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Customer",
            required:true
        },
        items:[
            {
               product_id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
               },
               quantity:Number,
               price:Number,
               total:Number,

            },
        ],
        subTotal:Number,
        vendorEarning:Number,
        platformCommisson:Number,
        vendorPaymentStatus:{
            type:String,
            enum:["pending","paid"],
            default:"pending",
        },
        orderStatus:{
            type:String,
            enum:["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default:"pending",
        },
    },
    {timestamps:true}
);
export default mongoose.model("VendorOrder",vendorOrderSchema);