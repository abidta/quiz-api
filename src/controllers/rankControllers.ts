import { NextFunction, Request, Response } from 'express'
import { User } from '../models/userModel.js'
import { SuccessResponse } from '../models/responseModel.js'

export const getYourRank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.app.locals.user
    const points = await User.find({}, 'totalPoint', {
      sort: { totalPoint: 1 },
    })
    const rank = points.findIndex((val) => val.id === userId) + 1
    res.json(new SuccessResponse(`Your rank is ${rank}`, { rank }))
  } catch (error) {
    next(error)
  }
}

export const getRankList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rankList = await User.find({}, '-password', {
      sort: { totalPoint: 1 },
    })
    console.log(rankList)
    res.json(new SuccessResponse('', rankList))
  } catch (error) {
    next(error)
  }
}
