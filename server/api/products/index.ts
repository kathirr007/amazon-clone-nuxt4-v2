// server/api/products.ts
import type { H3Event } from 'h3'
import { Product } from '~~/server/api/models/product'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'GET': {
      return await handleGetProducts()
    }

    case 'POST': {
      return await handleCreateProduct(event)
    }

    default:
      throw createError({
        statusCode: 405,
        message: `Method ${method} Not Allowed`,
      })
  }
})

// POST - Create a new product
async function handleCreateProduct(event: H3Event) {
  try {
    /* const body = await readBody(event)
    const files = await readMultipartFormData(event)

    const prodImages = files?.map(file => ({
      location: file.filename,
      size: file.data.length,
      originalname: file.filename,
    })) || []

    const product = new Product({
      owner: body.ownerID,
      category: body.categoryID,
      price: body.price,
      title: body.title,
      description: body.description,
      stockQuantity: body.stockQuantity,
      photo: files?.length ? files[0].filename : '',
      prodImages: files?.length ? prodImages : [],
    }) */

    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({ statusCode: 400, statusMessage: 'No form data received' })
    }

    const prodImages: any[] = []
    const payloadData: Record<string, any> = {}

    for (const field of formData) {
      if (field.filename) {
        const uploaded = await uploadToS3(field.data, field.filename, field.type || 'application/octet-stream')
        prodImages.push(uploaded)
      }
      else {
        payloadData[field.name!] = field.data.toString()
      }
    }

    if (prodImages.length > 0) {
      payloadData.photo = prodImages[0].location
      payloadData.prodImages = prodImages
    }

    const product = new Product({
      owner: payloadData.ownerID,
      category: payloadData.categoryID,
      price: payloadData.price,
      title: payloadData.title,
      description: payloadData.description,
      stockQuantity: payloadData.stockQuantity,
      photo: prodImages?.length ? prodImages[0].filename : '',
      prodImages: prodImages?.length ? prodImages : [],
    })

    await product.save()

    return {
      status: true,
      message: 'Product is Successfully saved..',
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

// GET - Get all products
async function handleGetProducts() {
  try {
    const products = await Product.find()
      .populate('owner category')
      .populate('reviews', 'rating')
      .exec()

    return {
      success: true,
      products,
    }
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error',
    })
  }
}
