import type { H3Event } from 'h3'
import type { IUser } from '~~/server/api/models/user'
import Address from '~~/server/api/models/address'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'GET':
      return await getSingleAddress(event)
    case 'PUT':
      return await updateAddress(event)
    case 'DELETE':
      return await deleteAddress(event)
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed',
      })
  }
})

// Get single address
async function getSingleAddress(event: H3Event) {
  try {
    const id = event.context.params?.id
    const address = await Address.findOne({ _id: id })

    return { success: true, address }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
}

// Update address
async function updateAddress(event: H3Event) {
  try {
    const id = event.context.params?.id
    const body = await readBody(event)

    const { user: auth } = await requireUserSession(event) // Assuming auth middleware sets this

    const foundAddress = await Address.findOne({
      user: (auth as IUser)._id,
      _id: id,
    })

    if (foundAddress) {
      if (body.country)
        foundAddress.country = body.country
      if (body.fullName)
        foundAddress.fullName = body.fullName
      if (body.streetAddress)
        foundAddress.streetAddress = body.streetAddress
      if (body.city)
        foundAddress.city = body.city
      if (body.state)
        foundAddress.state = body.state
      if (body.zipCode)
        foundAddress.zipCode = body.zipCode
      if (body.phoneNumber)
        foundAddress.phoneNumber = body.phoneNumber
      if (body.deliveryInstructions)
        foundAddress.deliveryInstructions = body.deliveryInstructions
      if (body.securityCode)
        foundAddress.securityCode = body.securityCode

      await foundAddress.save()
    }

    return { success: true, message: 'Successfully updated the address' }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
}

// Delete address
async function deleteAddress(event: H3Event) {
  try {
    const id = event.context.params?.id
    const { user: auth } = await requireUserSession(event)

    const deleteAddress = await Address.deleteOne({
      user: (auth as IUser)._id,
      _id: id,
    })

    if (deleteAddress) {
      return { success: true, message: 'Address has been deleted' }
    }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
}
