import { Router } from "express";
import { add, format } from "date-fns";
import Stripe from "stripe";
import verifyToken from "../middlewares/verify-token.js";
import User from "../models/user.js";
import Order from "../models/order.js";

const router = Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const SHIPMENT = {
  normal: {
    price: 13.98,
    days: 7
  },
  fast: {
    price: 49.98,
    days: 3
  }
};

function shipmentPrice(shipmentOption) {
  let estimated = format(
    add(new Date(), {
      days: shipmentOption.days
    }),
    "LLLL dd, yyyy hh:mm aa"
  );

  return {
    estimated,
    price: shipmentOption.price
  };
}

router.post("/shipment", (req, res) => {
  let shipment;
  if (req.body.shipment === "normal") {
    shipment = shipmentPrice(SHIPMENT.normal);
  } else {
    shipment = shipmentPrice(SHIPMENT.fast);
  }

  res.json({
    success: true,
    shipment: shipment
  });
});

router.post("/payment", verifyToken, async (req, res) => {
  let totalPrice = Math.round(req.body.totalPrice * 100);
  let foundUser = await User.findOne({ _id: req.decoded._id })
    .populate("address")
    .exec();

  stripe.customers
    .create({
      email: req.decoded.email,
      name: req.decoded.name,
      address: {
        country: foundUser.address.country,
        line1: foundUser.address.streetAddress,
        city: foundUser.address.city,
        state: foundUser.address.state,
        postal_code: foundUser.address.zipCode
      }
    })
    .then(customer => {
      return stripe.customers.createSource(customer.id, {
        source: "tok_visa"
      });
    })
    .then(source => {
      return stripe.charges.create({
        amount: totalPrice,
        currency: "inr",
        customer: source.customer,
        description: "Software development services"
      });
    })
    .then(async charge => {
      let order = new Order();
      let cart = req.body.cart;

      cart.map(product => {
        order.products.push({
          productID: product._id,
          quantity: parseInt(product.quantity),
          price: product.price
        });
      });

      order.owner = req.decoded._id;
      order.estimatedDelivery = req.body.estimatedDelivery;
      await order.save();

      res.json({
        success: true,
        message: "Successfully made a payment"
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
});

router.get("/categories", async (req, res) => {
  try {
    let categories = await Category.find();
    res.json({
      success: true,
      categories: categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

export default router;