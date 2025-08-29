import { compareSync, genSalt, hash } from 'bcryptjs'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: { type: Schema.Types.ObjectId, ref: 'Address' },
  admin: { type: Boolean, default: false },
})

UserSchema.pre('save', function (next) {
  const user = this

  genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }

    hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }

      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function (password, _) {
  const user = this
  return compareSync(password, user.password)
}

const User = mongoose.model('User', UserSchema)

export default User
