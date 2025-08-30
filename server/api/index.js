import bodyParser from 'body-parser'
import cors from 'cors'
// import mongoose from 'mongoose';
import dotenv from 'dotenv'
import express from 'express'
// import User from '~~/server/api/models/user.js';
import { fromNodeMiddleware } from 'h3'
import morgan from 'morgan'
import routes from './routes'

// import healthCheckRoutes from './routes/api-routes.js';
// import productRoutes from './routes/product.js';
// import categoryRoutes from './category.js';
// import ownerRoutes from './owner.js';
// import userRoutes from './auth.js';
// import reviewRoutes from './review.js';
// import addressRoutes from './address.js';
// import paymentRoutes from './payment.js';
// import orderRoutes from './order.js';
// import { default as searchRoutes } from './search.mjs';

// mongoose.set('useFindAndModify', false);
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('strictQuery', true)

dotenv.config()

const app = express()

// debugger
/* mongoose.connect(process.env.DATABASEURI)
  .then(() => {
    console.log('Connected to the database..');
  })
  .catch(err => {
    console.log(err);
  }); */

// Middlewares
app.use(morgan('dev'))
app.use(cors())
app.set('json spaces', 2)
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// app.use(healthCheckRoutes);
// app.use(productRoutes);
/* app.use(categoryRoutes);
app.use(ownerRoutes);
app.use(userRoutes);
app.use(reviewRoutes);
app.use(addressRoutes);
app.use(paymentRoutes);
app.use(orderRoutes);
app.use(searchRoutes); */

app.use('/api', routes)

export default fromNodeMiddleware(app)
