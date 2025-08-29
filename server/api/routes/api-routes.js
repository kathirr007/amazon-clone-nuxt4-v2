import { Router } from 'express'

const router = Router()

router.get('/_health', (req, res) => {
  res.json({
    message: 'Hello World from express server...!',
    health: 'Ok',
  })
})

export default router
