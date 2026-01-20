import express from 'express'
import{ addtoCart,getcartbyUser,updateCartItemQty,removecartItem,clearCart } from "../controllers/cartController.js"

const router = express.Router();
router.post("/add",addtoCart)
router.get("/:userId",getcartbyUser)
router.put("/updateqty",updateCartItemQty)
router.delete("/remove/:userId/:productId",removecartItem)
router.delete("/clear/:userId",clearCart);

export default router;