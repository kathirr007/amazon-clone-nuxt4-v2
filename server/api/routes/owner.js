import { Router } from 'express'
import { upload } from '../middlewares/upload-photo.js'
import Owner from '../models/owner'

const router = Router()

// POST request - create a new owner
router.post('/owners', upload.single('photo'), async (req, res) => {
  try {
    const owner = new Owner()
    owner.name = req.body.name
    owner.about = req.body.about
    owner.photo = req.file ? req.file.location : ''

    debugger

    await owner.save()

    res.json({
      status: true,
      message: 'Owner is created Successfully...',
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// GET request - get owners
router.get('/owners', async (req, res) => {
  try {
    const owners = await Owner.find()
    res.json({
      success: true,
      owners,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// GET request - get a single owner
router.get('/owners/:id', async (req, res) => {
  try {
    const owner = await Owner.findOne({ _id: req.params.id })
    res.json({
      success: true,
      owner,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// PUT request - Update a single owner
router.put('/owners/:id', upload.single('photo'), async (req, res) => {
  try {
    const updateQuery = {
      name: req.body.name,
      about: req.body.about,
    }
    if (req.file) {
      updateQuery.photo = req.file.location
    }
    const owner = await Owner.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: updateQuery,
      },
      { upsert: true },
    )
    res.json({
      success: true,
      updatedOwner: owner,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// DELETE request - delete a single owner
router.delete('/owners/:id', async (req, res) => {
  try {
    const deletedOwner = await Owner.findOneAndDelete({ _id: req.params.id })
    if (deletedOwner) {
      res.json({
        status: true,
        message: 'Owner is successfully deleted...',
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
