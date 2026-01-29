import express from 'express'
import { createOrder,getallOrders,deleteOrders,updateCustomerprofile,getCustomerbyId,
    getTodayOrderlist,getvendororders,getorderwisetrack} from '../controllers/customerController.js'

const router = express.Router();
router.post("/orders", createOrder);
router.get("/orders", getallOrders);
router.get("/vendorwiseorders", getvendororders);
router.get("/ordertrack", getorderwisetrack)
router.delete("/orders/:id", deleteOrders);
router.put("/updateprofile", updateCustomerprofile);
router.get("/getprofile", getCustomerbyId);
router.get("/todayorders",getTodayOrderlist)

export default router;