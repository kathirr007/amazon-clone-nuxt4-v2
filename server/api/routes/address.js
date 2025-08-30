import axios from 'axios'
import { Router } from 'express'
import verifyToken from '~~/server/api/middlewares/verify-token.js'
import Address from '~~/server/api/models/address'
import User from '~~/server/api/models/user'

const router = Router()

// POST request - create a new address
router.post('/addresses', verifyToken, async (req, res) => {
  try {
    const address = new Address()
    address.user = req.decoded._id
    address.country = req.body.country
    address.fullName = req.body.fullName
    address.streetAddress = req.body.streetAddress
    address.city = req.body.city
    address.state = req.body.state
    address.zipCode = req.body.zipCode
    address.phoneNumber = req.body.phoneNumber
    address.deliveryInstructions = req.body.deliveryInstructions
    address.securityCode = req.body.securityCode

    await address.save()

    res.json({
      success: true,
      message: 'Address is added Successfully...',
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// GET request - get all addresses
router.get('/addresses', verifyToken, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.decoded._id })
    res.json({
      success: true,
      addresses,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// GET request - get a addresses
router.get('/addresses/:id', verifyToken, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id })
    res.json({
      success: true,
      address,
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// GET Countries from third-party API
router.get('/countries', async (req, res) => {
  try {
    const countriesUrl = `https://countryapi.io/api/all?apikey=${process.env.COUNTRY_API_KEY}`
    const response = await axios.get(countriesUrl)

    res.json(response.data)
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// PUT request - Update a single address
router.put('/address/:id', verifyToken, async (req, res) => {
  try {
    const foundAddress = await Address.findOne({
      user: req.decoded._id,
      _id: req.params.id,
    })

    if (foundAddress) {
      if (req.body.country)
        foundAddress.country = req.body.country
      if (req.body.fullName)
        foundAddress.fullName = req.body.fullName
      if (req.body.streetAddress)
        foundAddress.streetAddress = req.body.streetAddress
      if (req.body.city)
        foundAddress.city = req.body.city
      if (req.body.state)
        foundAddress.state = req.body.state
      if (req.body.zipCode)
        foundAddress.zipCode = req.body.zipCode
      if (req.body.phoneNumber)
        foundAddress.phoneNumber = req.body.phoneNumber
      if (req.body.deliveryInstructions)
        foundAddress.deliveryInstructions = req.body.deliveryInstructions
      if (req.body.securityCode)
        foundAddress.securityCode = req.body.securityCode
    }

    await foundAddress.save()

    res.json({
      success: true,
      message: 'Succefully updated the adderss',
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// DELETE request - delete a single address
router.delete('/addresses/:id', verifyToken, async (req, res) => {
  try {
    const deleteAddress = await Address.remove({
      user: req.decoded._id,
      _id: req.params.id,
    })

    if (deleteAddress) {
      res.json({
        success: true,
        message: 'Address has been deleted',
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

// Set Default Address request
router.put('/addresses/set/default', verifyToken, async (req, res) => {
  try {
    const updatedAddressUser = await User.findOneAndUpdate(
      { _id: req.decoded._id },
      { $set: { address: req.body.id } },
    )

    if (updatedAddressUser) {
      res.json({
        success: true,
        message: 'Default Address has been set successfully',
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

// server/api/addresses.ts

// server/api/addresses/[id].ts

// server/api/countries.ts

// server/api/addresses/set/default.ts
