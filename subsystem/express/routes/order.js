import { Router } from 'express'
import verifyToken from '../middlewares/verify-token.js'
import Order from '../models/order.js'

const router = Router()

// GET request - get orders
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const products = await Order.find({ owner: req.decoded._id }).deepPopulate('owner products.productID.owner').exec()
    res.json({
      success: true,
      products,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

export default router
