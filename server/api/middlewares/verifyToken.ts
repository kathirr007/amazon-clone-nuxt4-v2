import type { Secret } from 'jsonwebtoken'
import { defineEventHandler, getHeaders } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const headers = getHeaders(event)
  let token = headers['x-access-token'] || headers.authorization
  const checkBearer = 'Bearer '

  if (token) {
    if (token.startsWith(checkBearer)) {
      token = token.slice(checkBearer.length, token.length)
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET as Secret)
      event.context.auth = decoded
    }
    catch (err) {
      console.log('Error verifying token:', err)
      return {
        success: false,
        message: 'Failed to authenticate',
      }
    }
  }
  else {
    return {
      success: false,
      message: 'No token Provided',
    }
  }
})
