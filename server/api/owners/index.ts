// server/api/owners/index.ts

import { H3Event } from 'h3'
import Owner from '~~/server/api/models/owner'

// POST - Create owner
export const POST = defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const formData = await readMultipartFormData(event)
    const photoFile = formData?.find(file => file.name === 'photo')

    const owner = new Owner({
      name: body.name,
      about: body.about,
      photo: photoFile ? photoFile.filename : ''
    })

    await owner.save()

    return {
      status: true,
      message: 'Owner is created Successfully...'
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
})

// GET - Get all owners
export const GET = defineEventHandler(async () => {
  try {
    const owners = await Owner.find()
    return {
      success: true,
      owners
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
})

