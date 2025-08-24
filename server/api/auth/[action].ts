import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import User from '~~/server/api/models/user'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method
  const action = getRouterParam(event, 'action')


  if (action === 'login' && method === 'POST') return handleLogin(event)
  if (action === 'signup' && method === 'POST') return handleSignup(event)
  if (action === 'getUser' && method === 'GET') return handleGetUser(event)
  if (action === 'updateUser' && method === 'PUT') return handleGetUser(event)

  throw createError({
    statusCode: 404,
    message: `Not Found api router`
  })
})

/**
 * ✅ SIGNUP
 */
async function handleSignup(event: H3Event) {
  const body = await readBody(event)
  if (!body.email || !body.password) {
    return { success: false, message: "Please enter email or password" }
  }

  try {
    let newUser = new User()
    newUser.name = body.name
    newUser.email = body.email
    newUser.password = body.password
    newUser = await newUser.save()

    const token = jwt.sign(newUser.toJSON(), process.env.SECRET as string, {
      expiresIn: 604800 // 1 week
    })

    return { success: true, token, message: "Successfully created new User" }
  } catch (err: any) {
    return { success: false, message: err.message }
  }
}

/**
 * ✅ LOGIN
 */
async function handleLogin(event: H3Event) {
  try {
    const body = await readBody(event)
    const foundUser = await User.findOne({ email: body.email })

    if (!foundUser) {
      return { success: false, message: "Authentication failed, User not found" }
    }

    if (foundUser.comparePassword(body.password)) {
      const token = jwt.sign(foundUser.toJSON(), process.env.SECRET as string, {
        expiresIn: 604800
      })

      return { success: true, token }
    } else {
      return { success: false, message: "Authentication failed, password is wrong!" }
    }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { success: false, message: err.message }
  }
}

/**
 * ✅ GET USER PROFILE
 */
async function handleGetUser(event: H3Event) {
  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!token) throw new Error('No token provided')

    const decoded = jwt.verify(token, process.env.SECRET as string)
    const foundUser = await User.findOne({ _id: (decoded as any)._id }).populate('address')

    if (foundUser) {
      return { success: true, user: foundUser }
    }

    return { success: false, message: "User not found" }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { success: false, message: err.message }
  }
}

/**
 * ✅ UPDATE USER PROFILE
 */
async function handleUpdateUser(event: H3Event) {
  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!token) throw new Error('No token provided')

    const decoded = jwt.verify(token, process.env.SECRET as string)
    const body = await readBody(event)

    const foundUser = await User.findOne({ _id: (decoded as any)._id })
    if (foundUser) {
      if (body.name) foundUser.name = body.name
      if (body.email) foundUser.email = body.email
      if (body.password) foundUser.password = body.password

      await foundUser.save()

      return { success: true, message: `Successfully updated ${body.name} Profile` }
    }

    return { success: false, message: "User not found" }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { success: false, message: err.message }
  }
}
