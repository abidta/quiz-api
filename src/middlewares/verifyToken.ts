import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import createError from 'http-errors'

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['access_token']
    if (!token) {
      throw createError(401, 'not authorized')
    }

    const verified = jwt.verify(token as string, JWT_SECRET)
    req.app.locals.user = verified._id
    next()
  } catch (error) {
    next(error)
  }
}
