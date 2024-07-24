import mongoose from 'mongoose'
import { env } from './env.js'

export function connectDatabase() {
  const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  }
  mongoose.connect(env.MONGODB_URI, clientOptions)
}
