import mongoose, { Model } from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema } = mongoose

interface IUserMethods {
  matchPassword(pswd: string): boolean
}
interface IUser {
  username: string
  password: string
}

type UserModel = Model<IUser, object, IUserMethods>
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
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

userSchema.pre('save', async function hashPassword(next) {
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (e) {
    next(e as Error)
  }
})
userSchema.method(
  'matchPassword',
  async function compare(clientPassword: string) {
    return await bcrypt.compare(clientPassword, this.password)
  }
)

const User = mongoose.model<IUser, UserModel>('User', userSchema)

export { User }
