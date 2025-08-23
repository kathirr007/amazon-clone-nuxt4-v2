import { Router } from 'express'
import Order from '../models/order.js'
import verifyToken from '../middlewares/verify-token.js'

const router = Router()

// GET request - get orders
router.get('/orders', verifyToken, async(req,res) => {
    try {
        let products = await Order.find({ owner: req.decoded._id }).deepPopulate('owner products.productID.owner').exec()
        res.json({
            success: true,
            products: products
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

export default router