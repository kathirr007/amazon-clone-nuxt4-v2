import { Router } from 'express'
import Category from '../models/category'

const router = Router()

// POST request - create a new category
router.post('/categories', async (req, res) => {
  try {
    const category = new Category()
    category.type = req.body.type

    const newCategory = await category.save()

    res.json({
      status: true,
      catAdded: newCategory,
      message: 'Category is created Successfully...',
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// GET request - get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find()
    res.json({
      success: true,
      categories,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// DELETE request - delete a single category
router.delete('/categories/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({ _id: req.params.id })
    if (deletedCategory) {
      res.json({
        status: true,
        message: 'Category is successfully deleted...',
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

export default router
