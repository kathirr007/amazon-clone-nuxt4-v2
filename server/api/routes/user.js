import { Router } from 'express'
import User from '../models/user'

const router = Router()


// GET request - get categories
router.get('/users', async(req,res) => {
    try {
        let users = await User.find()
        res.json({
            success: true,
            users
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

export default router