import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ amount: number }>(event)

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  })

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount, // in cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true }, // supports cards, wallets, etc.
    })

    return { clientSecret: paymentIntent.client_secret }
  }
  catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message })
  }
})
