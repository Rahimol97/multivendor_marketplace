import express from 'express'
import {getadminDashboardStats,pendingApprovals,updateVendorStatus,getAllCustomers,getAllVendors,blockUser,getvendorslist,getAllMessages, markAsRead, deleteMessage,getUnreadCount} from "../controllers/adminController.js"
import { setGlobalCommission,vendorCommisson,getcommisssion ,vendorCommissionReport} from '../controllers/globalCommissionController.js'
import { categoryupload } from '../../../middlewares/categoryupload.js';
import { addcategory,getcategories,getactivecategories,updatecategory,blockunblockcat } from '../controllers/adminController.js'

const router = express.Router();
router.get("/dashboard-stats",getadminDashboardStats );
router.get('/pendings',pendingApprovals);
router.patch('/updatestatus/:id',updateVendorStatus);
router.get('/allcustomers',getAllCustomers);
router.get('/allvendors',getAllVendors);
router.patch('/blockuser/:id',blockUser);
router.get('/vendorslist',getvendorslist);
////commission
router.post('/global-commision',setGlobalCommission);
router.put('/vendorwise-commision/:vendorId',vendorCommisson);
router.get("/global-commision",getcommisssion);
router.get("/vendor-commission-report", vendorCommissionReport);

/////category 
router.post("/addcategory",categoryupload.single("image"),addcategory);
router.get("/getcategories",getcategories);
router.get("/getactivecategories",getactivecategories);
router.patch("/toggleblock/:id",blockunblockcat);
router.put("/updatecategory/:id", categoryupload.single("image"), updatecategory);

////////getcontactdetails

router.get("/contact",  getAllMessages);
router.put("/contact/:id/read",  markAsRead);
router.delete("/contact/:id",  deleteMessage);
router.get("/unreadcontact",  getUnreadCount);
export default router;
