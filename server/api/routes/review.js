import { Router } from 'express'
import { upload } from '../middlewares/upload-photo.js'
import verifyToken from '../middlewares/verify-token.js'
import Product from '../models/product'
import Review from '../models/review'

const router = Router()

router.post('/reviews/:productID', [verifyToken, upload.single('photo')], async (req, res) => {
  try {
    const review = new Review()
    review.headline = req.body.headline
    review.body = req.body.body
    review.rating = req.body.rating
    review.photo = req.file ? req.file.location : ''
    review.user = req.decoded._id
    review.productID = req.params.productID

    await Product.update({ _id: review.productID }, { $push: { reviews: review._id } })

    const savedReview = await review.save()

    if (savedReview) {
      res.json({
        success: true,
        message: 'Successfully added Review',
      })
    }
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

router.get('/reviews/:productID', async (req, res) => {
  try {
    const productRewviews = await Review.find({
      productID: req.params.productID,
    })
      .populate('user')
      .exec()

    res.json({
      success: true,
      reviews: productRewviews,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

export default router
