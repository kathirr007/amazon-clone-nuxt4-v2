import { H3Event, H3Error } from 'h3'
import Address from "~~/server/api/models/address"
import User from "~~/server/api/models/user"
import verifyToken  from "~~/server/api/middlewares/verify-token"

// Get single address
export async function GET(event: H3Event) {
  try {
    const id = event.context.params?.id
    const address = await Address.findOne({ _id: id })
    
    return { success: true, address }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message 
    })
  }
}

// Update address
export async function PUT(event: H3Event) {
  try {
    const id = event.context.params?.id
    const body = await readBody(event)
    const decoded = await verifyToken(event)

    const foundAddress = await Address.findOne({
      user: (decoded as any)._id,
      _id: id
    })

    if (foundAddress) {
      if (body.country) foundAddress.country = body.country
      if (body.fullName) foundAddress.fullName = body.fullName
      if (body.streetAddress) foundAddress.streetAddress = body.streetAddress
      if (body.city) foundAddress.city = body.city
      if (body.state) foundAddress.state = body.state
      if (body.zipCode) foundAddress.zipCode = body.zipCode
      if (body.phoneNumber) foundAddress.phoneNumber = body.phoneNumber
      if (body.deliveryInstructions) foundAddress.deliveryInstructions = body.deliveryInstructions
      if (body.securityCode) foundAddress.securityCode = body.securityCode

      await foundAddress.save()
    }

    return { success: true, message: "Successfully updated the address" }
  } catch (err:any) {
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
}

// Delete address
export async function DELETE(event: H3Event) {
  try {
    const id = event.context.params?.id
    const decoded = await verifyToken(event)

    const deleteAddress = await Address.deleteOne({
      user: (decoded as any)._id,
      _id: id
    })

    if (deleteAddress) {
      return { success: true, message: "Address has been deleted" }
    }
  } catch (err:any) {
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
}
