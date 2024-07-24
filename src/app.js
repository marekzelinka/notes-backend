import cors from 'cors'
import express from 'express'
import { notesRouter } from './routes/notes.js'
import { connectDatabase } from './utils/db.js'
import {
  errorHandler,
  requestLogger,
  unknownEndpoint,
} from './utils/middleware.js'

export async function setupApp() {
  await connectDatabase()

  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(requestLogger)

  app.use('/api/notes', notesRouter)

  app.use(unknownEndpoint)
  // errorHandler needs to be the last loaded middleware
  app.use(errorHandler)

  return app
}
