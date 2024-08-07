import { NextFunction, Request, Response } from 'express'
import { Quiz, QuizResult } from '../models/questionModel.js'
import { SuccessResponse } from '../models/responseModel.js'
import createError from 'http-errors'
import { submitSchema } from '../models/zod.js'
import { Types } from 'mongoose'
import { POINTS } from '../config/constants.js'
import { pointUpdate } from '../services/rankServices.js'

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
    //for quiz stats
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
    console.log(stats)

    const failed = quiz.questions.length - stats.completed
    const point = stats.completed * POINTS.COMPLETED - failed * POINTS.FAILED
    console.log(point, 'point')

    const resultObj = {
      userId: userId,
      quizzes: [
        {
          quizId: quizId,
          completed: stats.completed,
          failed: failed,
          scorePercentage: (stats.completed / quiz.questions.length) * 100,
          point: point,
        },
      ],
    }
    const quizResult = await QuizResult.findOne({ userId: userId })
    console.log(quizResult, 'quiz result')

    if (!quizResult) {
      await QuizResult.create(resultObj)
    } else {
      const updateStatus = await QuizResult.updateOne(
        { userId: userId, 'quizzes.quizId': quizId },
        {
          $set: { 'quizzes.$': resultObj.quizzes[0] },
        }
      )

      // push new quiz result in to quizzes[]
      if (!updateStatus.modifiedCount) {
        await QuizResult.updateOne(
          { userId: userId },
          {
            $push: { quizzes: resultObj.quizzes[0] },
          }
        )
      }
    }
    await pointUpdate(userId)
    res.json(
      new SuccessResponse('Your quiz submitted successfully ', resultObj)
    )
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
  const { id } = req.query
  try {
    const [quizResult] = await QuizResult.find({ userId: req.app.locals.user })
    if (id) {
      const quiz = quizResult.quizzes.find(
        (val) => val.quizId == (id as unknown as Types.ObjectId)
      )

      return res.json(new SuccessResponse('', quiz))
    }
    res.json(new SuccessResponse('your all quiz results', quizResult))
  } catch (error) {
    next(error)
  }
}

export const getOverAllScore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quizResults = await QuizResult.findOne({
      userId: req.app.locals.user,
    }).lean()
    if (!quizResults) {
      throw createError(400)
    }
    const totalScore =
      quizResults?.quizzes.reduce((acc, val) => {
        return acc + val.scorePercentage
      }, 0) / quizResults?.quizzes.length
    res.json(
      new SuccessResponse(`Your total quiz score is ${totalScore}`, {
        totalScore: totalScore.toFixed(2),
      })
    )
  } catch (error) {
    next(error)
  }
}
