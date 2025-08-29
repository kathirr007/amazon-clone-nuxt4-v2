/* import mongoose from "mongoose";
import { genSalt, hash, compareSync } from "bcryptjs";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: { type: Schema.Types.ObjectId, ref: "Address" },
  admin: { type: Boolean, default: false },
});

UserSchema.pre("save", function (next) {
  const user = this;

  genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, next) {
  let user = this;
  return compareSync(password, user.password);
};

const User = mongoose.model("User", UserSchema);

export default User; */

import type { Document, Model } from 'mongoose'
import { compareSync, genSalt, hash } from 'bcryptjs'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

interface IUser extends Document {
  name?: string
  email: string
  password: string
  address?: mongoose.Types.ObjectId
  admin: boolean
  comparePassword: (password: string) => boolean
}

const UserSchema = new Schema<IUser>({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: { type: Schema.Types.ObjectId, ref: 'Address' },
  admin: { type: Boolean, default: false },
})

UserSchema.pre('save', async function (next) {
  try {
    // const user = this
    const salt = await new Promise<string>((resolve, reject) => {
      genSalt(10, (err, salt) => {
        if (err)
          reject(err)
        resolve(salt as string)
      })
    })

    const hashedPassword = await new Promise<string>((resolve, reject) => {
      hash(this.password, salt, (err, hash) => {
        if (err)
          reject(err)
        resolve(hash as string)
      })
    })

    this.password = hashedPassword
    next()
  }
  catch (error) {
    next(error as Error)
  }
})

UserSchema.methods.comparePassword = function (password: string): boolean {
  return compareSync(password, this.password)
}

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)

export { IUser, User, UserSchema }
export default User
