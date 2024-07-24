import mongoose from 'mongoose'
import { env } from './env.js'
import { logInfo } from './logger.js'

export async function connectDatabase() {
  const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  }
  await mongoose.connect(env.MONGODB_URI, clientOptions)
  await mongoose.connection.db.admin().command({ ping: 1 })
  logInfo('Pinged your deployment. You successfully connected to MongoDB!')
}
