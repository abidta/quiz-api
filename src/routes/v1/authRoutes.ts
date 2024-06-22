import express from 'express'
import { login, logout } from '../../controllers/authControllers.js'
import { verifyToken } from '../../middlewares/verifyToken.js'

const router = express.Router()

router.route('/login').post(login)
router.route('/logout').post(verifyToken, logout)

export default router
