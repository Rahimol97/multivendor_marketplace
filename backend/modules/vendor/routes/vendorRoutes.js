import express from 'express'
import { addProduct,getAllproducts,getproductById,deleteProduct,getvendorwiseProduct,updateProduct,updateVendorprofile ,getVendorwiseCustomerorder,getVendorbyId} from '../controllers/vendorController.js'

const router = express.Router();
router.get("/getprofile",getVendorbyId)
router.put("/updateprofile",updateVendorprofile)
router.post("/addproduct",addProduct);
router.get("/",getAllproducts)
router.get("/:id",getproductById)
router.get("/:vendorId",getvendorwiseProduct)
router.delete("/:id",deleteProduct)
router.put("/:id",updateProduct)
router.get("/:userId",getVendorwiseCustomerorder)

export default router;