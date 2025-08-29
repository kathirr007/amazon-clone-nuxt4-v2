import mongoose from 'mongoose'

const Schema = mongoose.Schema

const OwnerSchema = new Schema({
  name: String,
  about: String,
  photo: String,
})

const Owner = mongoose.model('Owner', OwnerSchema)

export default Owner
