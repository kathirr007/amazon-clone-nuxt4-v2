// server/api/products/[id].ts

import type { H3Event } from 'h3'
import type { Buffer } from 'node:buffer'
import { Product } from '~~/server/api/models/product'
import { uploadToS3 } from '~~/server/utils/s3'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'GET':
      return await getProduct(event)
    case 'PUT':
      return await updateProduct(event)
    case 'DELETE':
      return await deleteProduct(event)
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed',
      })
  }
})

// Get single product
async function getProduct(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')
    const product = await Product.findOne({ _id: id })
      .populate('owner category')
      .populate('reviews', 'rating')
      .exec()

    return {
      success: true,
      product,
    }
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error',
    })
  }
}

/* async function getUpdatePayload(event: H3Event) {
  function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
  }

  const allFields = await readMultipartFormData(event)

  if (!allFields) {
    throw createError({ statusCode: 400, statusMessage: 'No form data received' })
  }

  const payloadData: Record<string, any> = {
    prodImages: [],
  }

  allFields.forEach((field) => {
    if (field.filename) {
      // It's a file (image)
      if (field.name === 'prodImages') {
        payloadData.prodImages.push(
          new File([bufferToArrayBuffer(field.data)], field.filename, {
            type: field.type || 'application/octet-stream',
          }),
        )
      }
    }
    else {
      // It's a text field
      payloadData[field.name!] = field.data.toString()
    }
  })

  return payloadData
} */

// Update a product
async function updateProduct(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')

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
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error',
    })
  }
}

// Delete a product
async function deleteProduct(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')
    const deletedProduct = await Product.findOneAndDelete({ _id: id })

    if (deletedProduct) {
      return {
        success: true,
        message: 'Product is successfully deleted...',
      }
    }
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error',
    })
  }
}
