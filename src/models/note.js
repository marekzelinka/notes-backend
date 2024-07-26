import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: [5, 'Content is too short'],
    required: [true, 'Content is required'],
  },
  important: { type: Boolean, default: false },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
