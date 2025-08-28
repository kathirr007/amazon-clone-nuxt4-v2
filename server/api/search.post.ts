
import { algoliasearch, SearchQuery } from 'algoliasearch'

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_SECRET as string
)

/* const index = client.searchSingleIndex({
  indexName: process.env.ALGOLIA_INDEX as string
}) */

// POST handler for search using Algolia
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {hits} = await client.browse({
        indexName: process.env.ALGOLIA_INDEX as string,
        browseParams: {
            query: body.title,
        }
    })
    return hits
  } catch (err) {
    return {
      success: false, 
      message: err instanceof Error ? err.message : "Unknown error"
    }
  }
})

