
// server/api/auth.ts
import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import User from '../models/user'

// Signup Route
export const signupPOST = async (event: H3Event) => {
  const body = await readBody(event)
  
  if (!body.email || !body.password) {
    return {
      success: false,
      message: "Please enter email or password"
    }
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

    return {
      success: true,
      token,
      message: "Successfully created new User"
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message
    }
  }
}

// Get User Profile Route
export const userGET = async (event: H3Event) => {
  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!token) throw new Error('No token provided')

    const decoded = jwt.verify(token, process.env.SECRET as string)
    const foundUser = await User.findOne({ _id: (decoded as any)._id }).populate("address")

    if (foundUser) {
      return {
        success: true,
        user: foundUser
      }
    }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return {
      success: false,
      message: err.message
    }
  }
}

// Update Profile Route
export const userPUT = async (event: H3Event) => {
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
      
      return {
        success: true,
        message: `Successfully updated ${body.name} Profile`
      }
    }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return {
      success: false, 
      message: err.message
    }
  }
}

// Login Route
export const loginPOST = async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const foundUser = await User.findOne({ email: body.email })

    if (!foundUser) {
      return {
        success: false,
        message: "Authentication failed, User not found"
      }
    }

    if (foundUser.comparePassword(body.password)) {
      const token = jwt.sign(foundUser.toJSON(), process.env.SECRET as string, {
        expiresIn: 604800 // 1 week
      })

      return {
        success: true,
        token
      }
    } else {
      return {
        success: false,
        message: "Authentication failed, password is wrong!"
      }
    }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return {
      success: false,
      message: err.message
    }
  }
}

