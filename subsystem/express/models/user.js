import mongoose from "mongoose";
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

export default User;