import mongoose from 'mongoose'
import mongooseAlgolia from 'mongoose-algolia'

const Schema = mongoose.Schema

const ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  owner: { type: Schema.Types.ObjectId, ref: 'Owner' },
  title: String,
  description: String,
  photo: String,
  prodImages: Array,
  price: Number,
  stockQuantity: Number,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})

ProductSchema.virtual('averageRating').get(function () {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((total, review) => {
      return total + review.rating
    }, 0)
    return sum / this.reviews.length
  }
  return 0
})

ProductSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SECRET,
  indexName: process.env.ALGOLIA_INDEX,

  selector: 'title _id photo description price rating averageRating owner category',
  populate: {
    path: 'owner reviews category',
    // select: 'name'
  },
  debug: true,
})

const Product = mongoose.model('Product', ProductSchema)
Product.SyncToAlgolia()
Product.SetAlgoliaSettings({
  searchableAttributes: ['title', 'category', 'averageRating', 'price'],
})

export default Product
