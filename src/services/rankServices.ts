import { QuizResult } from '../models/questionModel.js'
import { User } from '../models/userModel.js'

export const pointUpdate = async (userId: string) => {
  try {
    const result = await QuizResult.findOne({ userId: userId }).lean()
    const points = result?.quizzes.reduce((acc, val) => {
      console.log(val.point)

      if (val.point) {
        return acc + val.point
      }

      return acc
    }, 0)
    console.log(points, 'lll')

    await User.updateOne({ _id: userId }, { totalPoint: points })
  } catch (error) {
    Promise.reject(error)
  }
}
