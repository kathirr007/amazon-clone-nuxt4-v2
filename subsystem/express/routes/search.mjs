import { algoliasearch } from 'algoliasearch'
import { Router } from 'express'

const router = Router()

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SECRET,
)

// const index = client.initIndex(process.env.ALGOLIA_INDEX)
const index = client.searchSingleIndex({
  indexName: process.env.ALGOLIA_INDEX,
})

// POST request - create search using Algolia
router.post('/search', async (req, res) => {
  try {
    const { hits } = await index.search(req.body.title)
    res.json(hits)
  }
  catch (err) {
    res.json({
      success: false,
      message: err.message,
    })
  }
})

export default router
