import type { H3Event } from 'h3'
import verifyToken from '~~/server/api/middlewares/verifyToken'

export async function verifyUser(event: H3Event) {
  await verifyToken(event)

  const { auth } = event.context

  return { auth }
}
