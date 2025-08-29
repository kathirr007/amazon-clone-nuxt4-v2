// server/api/reviews/[productID].ts
import type { H3Event } from 'h3'
import { Product } from '~~/server/api/models/product'
import { Review } from '~~/server/api/models/review'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'POST':
      return createReview(event)
    case 'GET':
      return getReview(event)
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed',
      })
  }
})

// POST handler for creating reviews
async function createReview(event: H3Event) {
  try {
    const body = await readBody(event)
    const { productID } = event.context.params as Record<string, string>
    const { user } = event.context.auth // Assuming auth middleware sets this

    // Handle file upload - would need separate implementation for Nuxt
    const photo = '' // TODO: Implement file upload handling

    const review = new Review({
      headline: body.headline,
      body: body.body,
      rating: body.rating,
      photo,
      user: user._id,
      productID,
    })

    await Product.updateOne(
      { _id: review.productID },
      { $push: { reviews: review._id } },
    )

    await review.save()

    return {
      success: true,
      message: 'Successfully added Review',
    }
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error',
    })
  }
}

// GET handler for fetching reviews
async function getReview(event: H3Event) {
  try {
    const { productID } = event.context.params as Record<string, string>

    const productReviews = await Review.find({
      productID,
    }).populate('user')

    return {
      success: true,
      reviews: productReviews,
    }
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error',
    })
  }
}
