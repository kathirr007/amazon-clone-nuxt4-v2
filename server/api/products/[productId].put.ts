import { defineEventHandler, readMultipartFormData } from 'h3'
import Product from '~~/server/api/models/product'
import { uploadToS3 } from '~~/server/utils/s3'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID is required' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No form data received' })
  }

  const prodImages: any[] = []
  const updateQuery: Record<string, any> = {}

  for (const field of formData) {
    if (field.filename) {
      const uploaded = await uploadToS3(field.data, field.filename, field.type || 'application/octet-stream')
      prodImages.push(uploaded)
    }
    else {
      updateQuery[field.name!] = field.data.toString()
    }
  }

  if (prodImages.length > 0) {
    updateQuery.photo = prodImages[0].location
    updateQuery.prodImages = prodImages
  }

  const product = await Product.findOneAndUpdate(
    { _id: id },
    { $set: updateQuery },
    { new: true, upsert: true },
  )

  return { success: true, updatedProduct: product }
})
