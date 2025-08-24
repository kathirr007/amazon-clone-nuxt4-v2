// server/api/orders.get.ts

// import { getServerSession } from '#auth'
import Order from '~~/server/api/models/order'

export default defineEventHandler(async (event) => {
  try {
    // Get authenticated session
    const session = await getUserSession(event)
    if (!session) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // @ts-ignore
    const products = await Order.find({ owner: session.user.id })
    // @ts-ignore
      .deepPopulate('owner products.productID.owner')
      .exec()

    return {
      success: true,
      products
    }

  } catch (err:any) {
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
})