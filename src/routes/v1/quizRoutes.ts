import express from 'express'
import {
  createQuestion,
  getAllQuizzes,
  getQuiz,
  submitAnswer,
} from '../../controllers/quizControllers.js'

const router = express.Router()

router.route('/create').post(createQuestion)
router.route('/submit').post(submitAnswer)
router.route('/:id').get(getQuiz)
router.route('/').get(getAllQuizzes)
router.route('/result').get()
export default router
