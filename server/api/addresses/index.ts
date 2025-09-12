import type { H3Event } from 'h3'
import type { IUser } from '~~/server/api/models/user'
import Address from '~~/server/api/models/address'

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
        message: 'Method not allowed',
      })
  }
})

// Create new address
async function createAddress(event: H3Event) {
  try {
    const body = await readBody(event)
    const { user: auth } = await requireUserSession(event)

    const address = new Address({
      user: (auth as IUser)._id,
      country: body.country,
      fullName: body.fullName,
      streetAddress: body.streetAddress,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      phoneNumber: body.phoneNumber,
      deliveryInstructions: body.deliveryInstructions,
      securityCode: body.securityCode,
    })

    await address.save()

    return { success: true, message: 'Address is added Successfully...' }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
}

// Get all addresses
async function getAllAddresses(event: H3Event) {
  try {
    const { user } = await requireUserSession(event) // Assuming auth middleware sets this

    const addresses = await Address.find({ user: (user as IUser)._id })

    return { success: true, addresses }
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      message: (err instanceof Error) ? err.message : 'Internal server error',
    })
  }
}
