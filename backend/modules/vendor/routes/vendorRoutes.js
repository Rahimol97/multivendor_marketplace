import express from 'express'
import { addProduct,getproductById,blockProduct,getvendorwiseProduct,updateProduct,updateVendorprofile ,getVendorwiseCustomerorder,
   unblockProduct,getVendorbyId,productWiseSalesReport,getvendorwiseProductblocked,lowstockproducts,getproductBybrand,updateVendorOrderStatus} from '../controllers/vendorController.js'
import {upload} from '../../../middlewares/upload.js'
import {authMiddleware} from '../../../middlewares/authmiddleware.js'
import {
  getVendorSummary,
  getSalesChart,
  getOrderStatusBreakdown,
  getTopProducts,
  getRecentOrders
} from "../controllers/vendorDashboardController.js";

const router = express.Router();
router.get("/getprofile",getVendorbyId)
router.put("/updateprofile",updateVendorprofile)

router.post("/addproduct", authMiddleware,upload.array("images", 5),addProduct);
router.get("/vendorwise",authMiddleware,getvendorwiseProduct)
router.get("/vendorwiseblocked",authMiddleware,getvendorwiseProductblocked)
router.patch("/blockproduct/:id",blockProduct)
router.patch("/unblockproduct/:id",unblockProduct)
router.get("/lowstock",authMiddleware,lowstockproducts)
router.get("/brandproducts",getproductBybrand);
router.put("/editproduct/:id", upload.array("images", 5),updateProduct)
router.get("/product/id/:id",getproductById)

router.get("/orders",authMiddleware,getVendorwiseCustomerorder)
/////////vendor orderstatus update
router.patch("/orderstatusupdate/:vendorOrderId",updateVendorOrderStatus)

///////////vendor dashboards

router.get("/summary",authMiddleware, getVendorSummary);
router.get("/sales-chart",authMiddleware, getSalesChart);
router.get("/order-status",authMiddleware, getOrderStatusBreakdown);
router.get("/top-products" ,authMiddleware, getTopProducts);
router.get("/recent-orders" ,authMiddleware, getRecentOrders);

router.get("/prduct-wise-sales-report",productWiseSalesReport)
export default router;