import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import { Types } from 'mongoose'

export const generateToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '24h',
  })
}
