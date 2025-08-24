import { H3Event } from "h3"
import verifyToken from "~~/server/api/middlewares/verifyToken"

export const verifyUser = async (event: H3Event) => {
    await verifyToken(event)
    
    const {auth} = event.context

    return {auth}
}