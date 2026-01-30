import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import mongoose from 'mongoose'
import connectDB from "./config/db.js"
import userRoutes from "./modules/admin/routes/userRoutes.js"
import adminRoutes from './modules/admin/routes/adminRoutes.js'
import customerRoutes from './modules/customer/routes/customerRoutes.js'
import cartRoutes from "./modules/customer/routes/cartRoutes.js"
import vendorRoutes from "./modules/vendor/routes/vendorRoutes.js"
import {authMiddleware,authorizeRoles} from './middlewares/authmiddleware.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
connectDB();
const app = express();
app.use(cookieParser());
app.use(cors({
  origin:"https://multivendor-marketplace-rouge.vercel.app",
  credentials: true
})); 

app.use(express.json());
app.use("/api/users",userRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/vendor",vendorRoutes);
app.use("/api/cart",cartRoutes)
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

/////,authMiddleware, authorizeRoles("vendor")
