import mongoose from 'mongoose'

const { Schema } = mongoose

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
)

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [optionSchema],
    },
  },
  { timestamps: true }
)

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    questions: [questionSchema],
  },
  { timestamps: true }
)

const userQuizResult = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  quizzes: [
    new Schema({
      quizId: { type: Schema.Types.ObjectId, required: true },
      scorePercentage: {
        type: Number,
        required: true,
      },
      point: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    }),
  ],
})
// const QuizOptions = mongoose.model('QuizOptions', optionSchema)
const Quiz = mongoose.model('Quiz', quizSchema)
const QuizQuestions = mongoose.model('QuizQuestions', questionSchema)
const QuizResult = mongoose.model('QuizResult', userQuizResult)

export { Quiz, QuizResult, QuizQuestions }
