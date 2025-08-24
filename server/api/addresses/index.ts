import { H3Event } from 'h3'
import Address from "~~/server/api/models/address"
import User from "~~/server/api/models/user"
import verifyToken  from "~~/server/api/middlewares/verifyToken"
import axios from "axios"

// Create new address
export async function POST(event: H3Event) {
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
export async function GET(event: H3Event) {
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