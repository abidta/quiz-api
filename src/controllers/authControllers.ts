import { NextFunction, Request, Response } from 'express'
import { User } from '../models/userModel.js'
import createError from 'http-errors'
import { SuccessResponse } from '../models/responseModel.js'
import { generateToken } from '../util/index.js'

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body

  try {
    const isUser = await User.exists({ username })
    if (!isUser) {
      //no Person with this email, throw error
      throw createError(401, 'Person not found, check email')
    }
    const user = await User.findById(isUser._id)
    if (!user?.matchPassword(password)) {
      throw createError(401, 'password dosent match, check password')
    }
    const token = generateToken(user._id)
    res.json(
      new SuccessResponse('', { access_token: token, username: user.username })
    )
  } catch (error) {
    next(error)
  }
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body
  console.log(req.body)

  try {
    const exists = await User.exists({ username })
    if (exists) {
      throw createError(400, 'user already exist')
    }
    await User.create({ username: username, password: password })
    res.json(new SuccessResponse(`User created success ${username}`))
  } catch (error) {
    next(error)
  }
}
