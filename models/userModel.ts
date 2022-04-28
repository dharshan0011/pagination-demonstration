import mongoose from 'mongoose'
import { Schema, model } from 'mongoose'

export interface IUser {
  name: string
  email: string
  avatar: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.models.User || model<IUser>('User', userSchema)

export default User
