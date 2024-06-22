import { NextFunction, Request, Response } from 'express'
import { Quiz, QuizResult } from '../models/questionModel.js'
import { SuccessResponse } from '../models/responseModel.js'
import createError from 'http-errors'
import { submitSchema } from '../models/zod.js'

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
  const { quizId, questions } = submitSchema.parse(req.body)
  const userId = req.app.locals.user
  try {
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
      throw createError(400, 'no quiz found')
    }
    const stats = questions.reduce(
      (acc, val) => {
        quiz.questions.forEach((question) => {
          if (question.id == val.id) {
            console.log(question)

            question.options.forEach((o) => {
              if (o.id == val.selected && o.isCorrect) {
                acc.completed++
              }
            })
          }
        })
        return acc
      },
      { completed: 0 }
    )

    const failed = quiz.questions.length - stats.completed
    const resultObj = {
      userId: userId,
      quizzes: [
        {
          quizId: quizId,
          completed: stats.completed,
          failed: failed,
          scorePercentage: (stats.completed / quiz.questions.length) * 100,
        },
      ],
    }
    const quizResult = await QuizResult.find({ userId: userId })
    console.log(quizResult)

    if (!quizResult) {
      await QuizResult.create(resultObj)
    } else {
      await QuizResult.updateOne({ userId: userId }, resultObj)
    }

    res.json(new SuccessResponse('Your quiz submitted successfully '))
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

export const getQuizResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  try {
    if (id) {
      return res.json(new SuccessResponse('', await QuizResult.findById(id)))
    }
    const quizResult = await QuizResult.find({ userId: req.app.locals.user })
    res.json(new SuccessResponse('your all quiz results', quizResult))
  } catch (error) {
    next(error)
  }
}
