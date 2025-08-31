export default defineEventHandler(async (event) => {
  // const { key } = await readBody(event)
  const key = getRouterParam(event, 'key')

  try {
    await deleteFromS3(key as string)
    return { success: true }
  }
  catch (error) {
    return { success: false, error }
  }
})
