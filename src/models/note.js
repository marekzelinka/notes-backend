import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: { type: Boolean, default: false },
})
noteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id
  },
})

export const Note = mongoose.model('Note', noteSchema)
