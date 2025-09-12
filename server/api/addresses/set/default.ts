import type { H3Event } from 'h3'
import type { IUser } from '~~/server/api/models/user'
import User from '~~/server/api/models/user'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'PUT': {
      return await setDefaultAddress(event)
    }

    default:
      throw createError({
        statusCode: 405,
        message: `Method ${method} Not Allowed`,
      })
  }
})

async function setDefaultAddress(event: H3Event) {
  try {
    const body = await readBody(event)
    const { user: auth } = await requireUserSession(event)

    const updatedAddressUser = await User.findOneAndUpdate(
      { _id: (auth as IUser)._id },
      { $set: { address: body.id } },
    )

    if (updatedAddressUser) {
      return { success: true, message: 'Default Address has been set successfully' }
    }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
}
