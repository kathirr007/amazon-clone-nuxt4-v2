// api/categories.ts

import type { H3Event } from 'h3'
import Category from '~~/server/api/models/category'

interface CategoryType {
  type: string
}

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'GET':
      return await getAllCategories()
    case 'POST':
      return await createCategory(event)
    case 'DELETE':
      return await deletedCategoryById(event)

    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed',
      })
  }
})

// Create category
async function createCategory(event: H3Event) {
  try {
    const body = await readBody<CategoryType>(event)
    const category = new Category()
    category.type = body.type

    const newCategory = await category.save()

    return {
      status: true,
      catAdded: newCategory,
      message: 'Category is created Successfully...',
    }
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error',
    })
  }
}

// Get all categories
async function getAllCategories() {
  try {
    const categories = await Category.find()
    return {
      success: true,
      categories,
    }
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error',
    })
  }
}

// Delete category by ID
async function deletedCategoryById(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')
    const deletedCategory = await Category.findOneAndDelete({ _id: id })

    if (deletedCategory) {
      return {
        status: true,
        message: 'Category is successfully deleted...',
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
