import { useServerStripe } from '#stripe/server'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  console.info('Stripe instance:', stripe)

  return {
    message: 'Inspect your terminal to see stripe server object',
  }
})
