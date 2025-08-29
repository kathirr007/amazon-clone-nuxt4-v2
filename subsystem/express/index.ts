import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { fromNodeMiddleware } from 'h3'
import mongoose from 'mongoose'
import morgan from 'morgan'

// @ts-expect-error no types
import routes from '~~/subsystem/express/routes/index.js'

// mongoose.set('useFindAndModify', false);
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
mongoose.set('strictQuery', true)

dotenv.config()

const app = express()

// debugger
mongoose.connect(process.env.DATABASEURI as string)
  .then(() => {
    console.log('Connected to the database..')
  })
  .catch((err) => {
    console.log(err)
  })

// Middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(routes) // Attach routes (e.g., /products)

export default fromNodeMiddleware(app)
