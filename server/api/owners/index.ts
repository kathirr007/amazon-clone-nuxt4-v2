// server/api/owners/index.ts

import type { H3Event } from 'h3'
import Owner from '~~/server/api/models/owner'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'GET':
      return await getAllOwners()
    case 'POST':
      return await createOwner(event)

    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed',
      })
  }
})

// POST - Create owner
export async function createOwner(event: H3Event) {
  try {
    // const body = await readBody(event)
    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({ statusCode: 400, statusMessage: 'No form data received' })
    }

    let photoFile: any
    const payloadData: Record<string, any> = {}

    for (const field of formData) {
      if (field.filename) {
        const uploaded = await uploadToS3(field.data, field.filename, field.type || 'application/octet-stream')
        photoFile = uploaded
      }
      else {
        payloadData[field.name!] = field.data.toString()
      }
    }

    if (!payloadData.name) {
      throw createError({ statusCode: 400, statusMessage: 'Name is required' })
    }

    const owner = new Owner({
      name: payloadData.name,
      about: payloadData.about,
      photo: photoFile ? photoFile.location : '',
    })

    await owner.save()

    return {
      success: true,
      message: 'Owner is created Successfully...',
    }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
}

// GET - Get all owners
export async function getAllOwners() {
  try {
    const owners = await Owner.find()
    return {
      success: true,
      owners,
    }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  }
}
