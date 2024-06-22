import { NextFunction, Request, Response } from 'express'
import { Quiz } from '../models/questionModel.js'
import { SuccessResponse } from '../models/responseModel.js'
import createError from 'http-errors'

export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, questions } = req.body

  try {
    await Quiz.create({
      title: title,
      description: description,
      questions: questions,
    })
    res.json(new SuccessResponse('new quiz created successfully'))
  } catch (error) {
    next(error)
  }
}

export const submitAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quizId, questions } = req.body
  try {
    const question = await Quiz.exists(qId)
    if (!question) {
      throw createError(400, 'no quiz found')
    }

    res.json(new SuccessResponse('Your answer is '))
  } catch (error) {
    next(error)
  }
}

export const getQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  try {
    const isQuiz = await Quiz.findById(id)
    if (!isQuiz) {
      throw createError(400, `quize not found given ${id}`)
    }
    return res.json(new SuccessResponse('', isQuiz))
  } catch (error) {
    next(error)
  }
}

export const getAllQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quizzes = await Quiz.find()

    res.json(new SuccessResponse('', quizzes))
  } catch (error) {
    next(error)
  }
}
