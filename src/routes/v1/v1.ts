import express from 'express'
import authRoutes from './authRoutes.js'
import quizRoutes from './quizRoutes.js'
import { verifyToken } from '../../middlewares/verifyToken.js'

const router = express.Router()

// API /api/v1
router
  .use(
    '/auth',
    /* #swagger.tags = ['Auth routes']
    #swagger.responses[500] */
    authRoutes
  )
  .use(
    '/quiz',
    /* #swagger.tags = ['Auth routes']
    #swagger.responses[500] */
    verifyToken,
    quizRoutes
  )

export default router
