import type { IUser } from '~~/server/api/models/user'
// server/api/payment.post.ts
import { createError, defineEventHandler, readBody } from 'h3'
import Stripe from 'stripe'
import { Order } from '~~/server/api/models/order'
import { User } from '~~/server/api/models/user'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

interface CartItem {
  _id: string
  quantity: string
  price: number
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event) // Assuming auth middleware sets this

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const body = await readBody(event)
  const totalPrice = Math.round(body.totalPrice * 100)

  const foundUser = await User.findOne({ _id: (user as IUser)._id }).populate('address') as any

  try {
    const customer = await stripe.customers.create({
      email: (user as IUser).email,
      name: (user as IUser).name,
      address: {
        country: foundUser.address.country,
        line1: foundUser.address.streetAddress,
        city: foundUser.address.city,
        state: foundUser.address.state,
        postal_code: foundUser.address.zipCode,
      },
    })

    const source = await stripe.customers.createSource(customer.id, {
      source: 'tok_visa',

    })

    await stripe.charges.create({
      amount: totalPrice,
      currency: 'inr',
      // @ts-expect-error no type
      customer: source.customer,
      description: 'Software development services',

    })

    const order = new Order()
    const cart = body.cart as CartItem[]

    cart.forEach((product) => {
      order.products.push({
        // @ts-expect-error no type
        productID: product._id,
        quantity: Number.parseInt(product.quantity),
        price: product.price,
      })
    })

    order.owner = (user as IUser)._id
    order.estimatedDelivery = body.estimatedDelivery
    await order.save()

    return {
      success: true,
      message: 'Successfully made a payment',
    }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
})
