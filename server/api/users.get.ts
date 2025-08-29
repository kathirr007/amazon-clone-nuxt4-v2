import User from '~~/server/api/models/user'

export default defineEventHandler(async () => {
  try {
    const users = await User.find()
    return {
      success: true,
      users,
    }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
})
