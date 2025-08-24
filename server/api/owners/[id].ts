// server/api/owners/[id].ts

import { H3Event } from 'h3'
import Owner from '~~/server/api/models/owner'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'GET':
      return await getSingleOwner(event)
    case 'PUT':
      return await updateOwner(event) 
    case 'DELETE':
      return await deleteOwner(event)
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
})

// GET - Get single owner
const getSingleOwner = async (event: H3Event) => {
  try {
    const id = getRouterParam(event, 'id')
    const owner = await Owner.findOne({ _id: id })
    return {
      success: true,
      owner
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
}

// PUT - Update owner
const updateOwner = async (event: H3Event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const formData = await readMultipartFormData(event)
    const photoFile = formData?.find(file => file.name === 'photo')

    const updateQuery: any = {
      name: body.name,
      about: body.about
    }

    if (photoFile) {
      updateQuery.photo = photoFile.filename
    }

    const owner = await Owner.findOneAndUpdate(
      { _id: id },
      { $set: updateQuery },
      { upsert: true }
    )

    return {
      success: true,
      updatedOwner: owner
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
}

// DELETE - Delete owner
const deleteOwner = async (event: H3Event) => {
  try {
    const id = getRouterParam(event, 'id')
    const deletedOwner = await Owner.findOneAndDelete({ _id: id })
    
    if (deletedOwner) {
      return {
        status: true,
        message: "Owner is successfully deleted..."
      }
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
}