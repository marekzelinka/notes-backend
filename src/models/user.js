import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minLength: [3, 'Username is too short'],
    validate: {
      validator: validateUsernmae,
      message: 'Username is not valid',
    },
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
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

function validateUsernmae(username) {
  return (
    /^[a-z._]+$/i.test(username) &&
    !username.startsWith('.') &&
    !username.startsWith('_') &&
    !username.endsWith('.') &&
    !username.endsWith('_') &&
    !username.includes('..') &&
    !username.includes('__') &&
    !username.includes('._') &&
    !username.includes('_.')
  )
}
