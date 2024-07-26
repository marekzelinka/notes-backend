import mongoose from 'mongoose'
import { User } from './user.js'

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: { type: Boolean, default: false },
  user: {
    type: mongoose.Types.ObjectId,
    ref: User,
  },
})
noteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id
  },
})

export const Note = mongoose.model('Note', noteSchema)
