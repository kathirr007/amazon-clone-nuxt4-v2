import { Router } from 'express'

import addressRoutes from './address.js'
import healthCheckRoutes from './api-routes.js'
import userRoutes from './auth.js'
import categoryRoutes from './category.js'
import orderRoutes from './order.js'
import ownerRoutes from './owner.js'
import paymentRoutes from './payment.js'
import productRoutes from './product.js'
import reviewRoutes from './review.js'
import searchRoutes from './search.js'
import usersRoutes from './user.js'

const router = Router()

router.use(healthCheckRoutes)
router.use(productRoutes)
router.use(categoryRoutes)
router.use(ownerRoutes)
router.use(userRoutes)
router.use(reviewRoutes)
router.use(addressRoutes)
router.use(paymentRoutes)
router.use(orderRoutes)
router.use(searchRoutes)
router.use(usersRoutes)

export default router
