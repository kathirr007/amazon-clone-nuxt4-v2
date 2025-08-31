// server/api/reviews/[productID].ts
import type { H3Event } from 'h3'
import type { IUser } from '~~/server/api/models/user'
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
    const productID = getRouterParam(event, 'productID')
    // const { productID } = event.context.params as Record<string, string>
    const { user } = await requireUserSession(event) // Assuming auth middleware sets this

    // Handle file upload - would need separate implementation for Nuxt
    // const photo = '' // TODO: Implement file upload handling
    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({ statusCode: 400, statusMessage: 'No form data received' })
    }

    let photoFile: any
    const payloadData: Record<string, any> = {}

    for (const field of formData) {
      if (field.filename) {
        const uploaded = await uploadToS3(field.data, field.filename, field.type || 'application/octet-stream')
        photoFile = uploaded
      }
      else {
        payloadData[field.name!] = field.data.toString()
      }
    }

    if (photoFile) {
      payloadData.photo = photoFile.location
    }

    if (!payloadData.rating) {
      throw createError({ statusCode: 400, statusMessage: 'Rating is required' })
    }

    const review = new Review({
      headline: payloadData.headline,
      body: payloadData.body,
      rating: payloadData.rating,
      photo: payloadData.photo ?? '',
      user: (user as IUser)._id,
      productID,
    })

    await review.save()

    await Product.updateOne(
      { _id: review.productID },
      { $push: { reviews: review._id } },
    )

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
    // const { productID } = event.context.params as Record<string, string>
    const productID = getRouterParam(event, 'productID')

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
