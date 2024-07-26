import mongoose from 'mongoose'
import { Note } from './note.js'

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Types.ObjectId,
      ref: Note,
    },
  ],
})
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id
    // the passwordHash should not be revealed
    delete ret.passwordHash
  },
})

export const User = mongoose.model('User', userSchema)
