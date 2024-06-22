import z from 'zod'

const questionSchema = z.object({
  id: z.string().min(1),
  selected: z.string().min(1),
})
export const submitSchema = z.object({
  quizId: z.string().min(1),
  questions: z.array(questionSchema),
})
