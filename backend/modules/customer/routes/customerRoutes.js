import express from 'express'
import { createOrder,getallOrders,getOrderbyId,deleteOrders,updateCustomerprofile,getCustomerbyId,
    getTodayOrderlist} from '../controllers/customerController.js'

const router = express.Router();
router.post("/orders", createOrder);
router.get("/orders", getallOrders);
router.get("/orders/:id", getOrderbyId);
router.delete("/orders/:id", deleteOrders);
router.put("/updateprofile", updateCustomerprofile);
router.get("/getprofile", getCustomerbyId);
router.get("/todayorders",getTodayOrderlist)

export default router;