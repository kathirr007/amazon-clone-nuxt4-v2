import { Router } from 'express'
import { upload } from '../middlewares/upload-photo.js'
import Product from '../models/product.ts'

const router = Router()

// POST request - create a new product
router.post('/products', upload.array('prodImages', 3), async (req, res) => {
  try {
    const prodImages = req.files.map((file) => {
      return {
        location: file.location,
        size: file.size,
        originalname: file.originalname,
      }
    })

    const product = new Product()

    product.owner = req.body.ownerID
    product.category = req.body.categoryID
    product.price = req.body.price
    product.title = req.body.title
    product.description = req.body.description
    product.stockQuantity = req.body.stockQuantity
    product.photo = req.files.length !== 0 ? req.files[0].location : ''
    product.prodImages = req.files.length !== 0 ? prodImages : []

    await product.save()

    res.json({
      status: true,
      message: 'Product is Successfully saved..',
      prodImages,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// GET request - get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('owner category')
      .populate('reviews', 'rating')
      .exec()
    res.json({
      success: true,
      products,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// GET request - get a single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id })
      .populate('owner category')
      .populate('reviews', 'rating')
      .exec()
    res.json({
      success: true,
      product,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// PUT request - Update a single product
router.put('/products/:id', upload.array('prodImages'), async (req, res) => {
  try {
    const prodImages = req.files
      ? req.files.map((file) => {
          return {
            location: file.location,
            size: file.size,
            originalname: file.originalname,
          }
        })
      : []
    const updateQuery = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      stockQuantity: req.body.stockQuantity,
      category: req.body.categoryID,
      owner: req.body.ownerID,
    }
    if (req.files.length !== 0) {
      updateQuery.photo = req.files[0].location
      updateQuery.prodImages = prodImages
    }
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: updateQuery,
      },
      { upsert: true },
    )
    res.json({
      success: true,
      updatedProduct: product,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// DELETE request - delete a single product
router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id })
    if (deletedProduct) {
      res.json({
        status: true,
        message: 'Product is successfully deleted...',
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
