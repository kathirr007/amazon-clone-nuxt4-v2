// server/api/owners/[id].ts

import type { H3Event } from 'h3'
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
        message: 'Method not allowed',
      })
  }
})

// GET - Get single owner
async function getSingleOwner(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')
    const owner = await Owner.findOne({ _id: id })
    return {
      success: true,
      owner,
    }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
}

// PUT - Update owner
async function updateOwner(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Owner id is required',
      })
    }

    /* const body = await readBody(event)
    const formData = await readMultipartFormData(event)
    const photoFile = formData?.find(file => file.name === 'photo')

    const updateQuery: any = {
      name: body.name,
      about: body.about,
    }

    if (photoFile) {
      updateQuery.photo = photoFile.filename
    } */

    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({ statusCode: 400, statusMessage: 'No form data received' })
    }

    let photoFile: any
    const updateQuery: Record<string, any> = {}

    for (const field of formData) {
      if (field.filename) {
        const uploaded = await uploadToS3(field.data, field.filename, field.type || 'application/octet-stream')
        photoFile = uploaded
      }
      else {
        updateQuery[field.name!] = field.data.toString()
      }
    }

    if (photoFile) {
      updateQuery.photo = photoFile.location
    }

    if (!updateQuery.name) {
      throw createError({ statusCode: 400, statusMessage: 'Name is required' })
    }

    const owner = await Owner.findOneAndUpdate(
      { _id: id },
      { $set: updateQuery },
      { upsert: true },
    )

    return {
      success: true,
      updatedOwner: owner,
    }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
}

// DELETE - Delete owner
async function deleteOwner(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')

    const deletedOwner = await Owner.findOneAndDelete({ _id: id })

    if (deletedOwner) {
      return {
        success: true,
        message: 'Owner is successfully deleted...',
      }
    }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
}
