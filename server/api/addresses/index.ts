import { H3Event } from 'h3'
import Address from "~~/server/api/models/address"
import verifyToken  from "~~/server/api/middlewares/verifyToken"

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'GET':
      return await getAllAddresses(event)
    case 'POST':
      return await createAddress(event) 
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
})

// Create new address
async function createAddress(event: H3Event) {
  try {
    const body = await readBody(event)
    const decoded = await verifyToken(event)

    const address = new Address({
      user: (decoded as any)._id,
      country: body.country,
      fullName: body.fullName, 
      streetAddress: body.streetAddress,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      phoneNumber: body.phoneNumber,
      deliveryInstructions: body.deliveryInstructions,
      securityCode: body.securityCode
    })

    await address.save()

    return { success: true, message: "Address is added Successfully..." }
  } catch (err:any) {
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
}

// Get all addresses
async function getAllAddresses(event: H3Event) {
  try {
    const decoded = await verifyToken(event)
    const addresses = await Address.find({ user: (decoded as any)._id })
    
    return { success: true, addresses }
  } catch (err:any) {
    throw createError({
      statusCode: 500, 
      message: err.message
    })
  }
}