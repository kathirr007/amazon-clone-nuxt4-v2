export async function GET() {
  try {
    const countriesUrl = `https://countryapi.io/api/all?apikey=${process.env.COUNTRY_API_KEY}`
    const response = await fetch(countriesUrl)
    const data = await response.json()
    
    return data
  } catch (err:any) {
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
}