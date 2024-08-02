import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import { loginRouter } from './controllers/login.js'
import { notesRouter } from './controllers/notes.js'
import { usersRouter } from './controllers/users.js'
import { connectDatabase } from './utils/db.js'
import {
  errorHandler,
  requestLogger,
  unknownEndpoint,
} from './utils/middleware.js'

connectDatabase()

export const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(unknownEndpoint)
// errorHandler should be the last loaded middleware
app.use(errorHandler)
