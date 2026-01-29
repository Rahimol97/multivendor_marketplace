import express from 'express'
import { addProduct,getAllproducts,getproductById,deleteProduct,getvendorwiseProduct,updateProduct,updateVendorprofile ,getVendorwiseCustomerorder,
    getVendorbyId,productWiseSalesReport} from '../controllers/vendorController.js'
import {upload} from '../../../middlewares/upload.js'

const router = express.Router();
router.get("/getprofile",getVendorbyId)
router.put("/updateprofile",updateVendorprofile)
router.post("/addproduct",upload.array("images", 5),addProduct);
router.get("/",getAllproducts)
router.get("/:id",getproductById)
router.get("/vendor-wise/:vendorId",getvendorwiseProduct)
router.delete("/:id",deleteProduct)
router.put("/:id", upload.array("images", 5),updateProduct)
router.get("/:userId",getVendorwiseCustomerorder)
router.get("/prduct-wise-sales-report",productWiseSalesReport)

export default router;