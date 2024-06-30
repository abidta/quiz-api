import 'dotenv/config'
import { readFile } from 'fs/promises'
import { Quiz } from '../src/models/questionModel.js'
import { connectDb } from '../src/config/db.js'

const seedDb = async () => {
  try {
    await connectDb()
    const seedData = JSON.parse(
      await readFile('./seed/mongoSeed.json', 'utf-8')
    )
    await Quiz.deleteMany({})
    await Quiz.insertMany(seedData)
    console.log('seeding is completed')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

seedDb()
