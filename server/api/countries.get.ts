import { H3Event } from "h3"

export default defineEventHandler(async (event: H3Event) => {

  try {
    const countriesUrl = `https://countryapi.io/api/all?apikey=${process.env.COUNTRY_API_KEY}`
    const response = await fetch(countriesUrl)
    const data = await response.json()
    
    return data
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: (err instanceof Error) ? err.message : "Internal server error"
    })
  }

})