import express from 'express'
import {getadminDashboardStats,pendingApprovals,updateVendorStatus,getAllCustomers,getAllVendors,blockUser,unblockUser} from "../controllers/adminController.js"
import { setGlobalCommission,vendorCommisson,getcommisssion ,vendorCommissionReport} from '../controllers/globalCommissionController.js'
const router = express.Router();
router.get("/dashboard-stats",getadminDashboardStats );
router.get('/pendings',pendingApprovals);
router.patch('/updatestatus/:id',updateVendorStatus);
router.get('/allcustomers',getAllCustomers);
router.get('/allvendors',getAllVendors);
router.put('/blockuser/:id',blockUser);
router.put('/unblockuser/:id',unblockUser);
////commission
router.post('/global-commision',setGlobalCommission);
router.put('/vendorwise-commision/:vendorId',vendorCommisson);
router.get("/global-commision",getcommisssion);
router.get("/vendor-commission-report", vendorCommissionReport);
export default router;