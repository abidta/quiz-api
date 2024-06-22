import 'dotenv/config'
import express from 'express'
import v1Routes from './routes/v1/v1.js'
import logger from 'morgan'
import { errorHandler, notFoundErr } from './middlewares/errorMiddleware.js'
import cors from 'cors'
import { createRequire } from 'module'
import swaggerUi from 'swagger-ui-express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { NODE_ENV } from './config/env.js'

const app = express()

let swaggerDocument

//swagger doc only load in development
if (NODE_ENV !== 'production') {
  const require = createRequire(import.meta.url)
  swaggerDocument = require('../swagger-output.json')
}

//helmet middleware
app.use(helmet())

//regular middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(logger('dev'))
app.use(cors({ origin: '*' }))

//routes
app.use('/ping', (req, res) => res.json('pong'))
app.use('/api/v1', v1Routes)

//docs
if (NODE_ENV !== 'production') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

//error middlewares
// catch 404 and forward to error handler
app.use(notFoundErr)

//error handler
app.use(errorHandler)

export default app
