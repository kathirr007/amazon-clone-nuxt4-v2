import { Router } from "express";
import User from "../models/user";
import verifyToken from "../middlewares/verify-token.js";
import jwt from "jsonwebtoken";

const router = Router();

/* Signup Route */
router.post("/auth/signup", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({
      success: false,
      message: "Please enter email or password"
    });
  } else {
    try {
      let newUser = new User();
      let token = "";
      newUser.name = req.body.name;
      newUser.email = req.body.email; 
      newUser.password = req.body.password;
      newUser = await newUser.save();
      token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
        expiresIn: 604800 // 1 week
      });

      res.json({
        success: true,
        token: token,
        message: "Successfully created new User"
      });
    } catch (err) {
      res.json({
        success: false,
        message: err.message
      });
    }
  }
});

/* Profile Route */
router.get("/auth/user", verifyToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id })
      .populate("address")
      .exec();
    if (foundUser) {
      res.json({
        success: true,
        user: foundUser
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/* Update a profile */
router.put("/auth/user", verifyToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id });
    if (foundUser) {
      console.log(req.body);
      if (req.body.name) foundUser.name = req.body.name;
      if (req.body.email) foundUser.email = req.body.email;
      if (req.body.password) foundUser.password = req.body.password;

      await foundUser.save();
      res.json({
        success: true,
        message: `Successfully updated ${req.body.name} Profile`
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/* Login Route */
router.post("/auth/login", async (req, res) => {
  try {
    let foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      res.json({
        success: false,
        message: "Authentication failed, User not found"
      });
    } else {
      if (foundUser.comparePassword(req.body.password)) {
        let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: token
        });
      } else {
        res.json({
          success: false,
          message: "Authentication failed, password is wrong!"
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

export default router;