

// import express from "express";
// import { addToCart, cancelStatus, checkoutCart,getActiveCart, getCart, reOrder, updateCart } from "../../controllers/cartController.js";
// import { authUser } from '../../middlewares/authUser.js'
// const router = express.Router()

// router.post('/add',addToCart);
// router.get('/get',authUser,getCart);
// router.post('/checkout',authUser,checkoutCart)
// router.get('/active',authUser,getActiveCart)
// router.put('/update',authUser,updateCart)
// router.put('/cancel/:orderId',authUser,cancelStatus)
// router.post('/reorder/:orderId',authUser,reOrder)


// export default router



import express from "express"
//import { authUser } from "../middlewares/authUser.js"
import { clearCart, getCart, updateCart } from "../../controllers/cartController.js"
import { authUser } from "../../middlewares/authUser.js"

const router = express.Router()

// router.route('/update').post(authUser, updateCart)
router.route('/update').post(updateCart)
// router.post("/add-to-cart",addCourseToCart);
router.route('/').get(authUser, getCart)
router.route('/clear').post(authUser, clearCart)

export default router


