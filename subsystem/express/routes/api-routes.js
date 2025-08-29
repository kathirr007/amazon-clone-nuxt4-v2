import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json('Hello World from express server...!')
})

export default router
