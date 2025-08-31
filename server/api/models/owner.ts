import type { Document } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IOwner extends Document {
  name: string
  about: string
  photo: string
}

const OwnerSchema = new Schema<IOwner>({
  name: String,
  about: String,
  photo: String,
})

const Owner = mongoose.model<IOwner>('Owner', OwnerSchema)

export default Owner
export { IOwner, Owner, OwnerSchema }
