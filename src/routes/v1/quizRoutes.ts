import express from 'express'
import {
  createQuestion,
  getAllQuizzes,
  getQuiz,
  getQuizResult,
  submitAnswer,
} from '../../controllers/quizControllers.js'

const router = express.Router()

router.route('/create').post(createQuestion)
router.route('/submit').post(submitAnswer)
router.route('/results').get(getQuizResult)
router.route('/:id').get(getQuiz)
router.route('/').get(getAllQuizzes)
export default router
