import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'user name is required'],
      minLength: [3, 'minimum 3 character for user names you entered :{VALUE}'],
      maxLength: [30, 'maximum 30 character for user names'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'password must include a lowercase, uppercase, number and special character',
      ],
    },
  },
  { timestamps: true }
)

async function hashPassword(next) {
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (e) {
    next(e)
  }
}
async function compare(clientPassword: string) {
  return await bcrypt.compare(clientPassword, this.password)
}

userSchema.pre('save', hashPassword)
userSchema.method('matchPassword', compare)

const User = mongoose.model('User', userSchema)

export { User }
