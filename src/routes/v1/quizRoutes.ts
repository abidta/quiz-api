import express from 'express'
import {
  createQuestion,
  getAllQuizzes,
  getOverAllScore,
  getQuiz,
  getQuizResult,
  submitAnswer,
} from '../../controllers/quizControllers.js'

const router = express.Router()

router.route('/create').post(createQuestion)
router.route('/submit').post(submitAnswer)
router.route('/results').get(getQuizResult)
router.route('/results/overall_score').get(getOverAllScore)
router.route('/:id').get(getQuiz)
router.route('/').get(getAllQuizzes)
export default router
