import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { Note } from './models/note.js'

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

const app = express()

run().catch(console.dir)

async function run() {
  const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  }
  await mongoose.connect(MONGODB_URI, clientOptions)
  await mongoose.connection.db.admin().command({ ping: 1 })
  console.log('Pinged your deployment. You successfully connected to MongoDB!')

  app.use(express.json())
  app.use(requestLogger)
  app.use(cors())

  app.get('/', (_req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  app.get('/api/notes', async (_req, res, next) => {
    try {
      const notes = await Note.find()
      res.send(notes)
    } catch (error) {
      next(error)
    }
  })

  app.get('/api/notes/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const note = await Note.findById(id)

      if (!note) {
        return res.status(404).end()
      }

      res.send(note)
    } catch (error) {
      next(error)
    }
  })

  app.delete('/api/notes/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      await Note.findByIdAndDelete(id)

      res.status(204).end()
    } catch (error) {
      next(error)
    }
  })

  app.post('/api/notes', async (req, res, next) => {
    try {
      const { content, important } = req.body

      const note = new Note({
        content,
        important: Boolean(important),
      })
      const savedNote = await note.save()

      res.status(201).send(savedNote)
    } catch (error) {
      next(error)
    }
  })

  app.put('/api/notes/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const { content, important } = req.body

      const updatedNote = await Note.findByIdAndUpdate(
        id,
        {
          content,
          important: Boolean(important) || false,
        },
        {
          new: true,
          runValidators: true,
          context: 'query',
        },
      )

      res.send(updatedNote)
    } catch (error) {
      next(error)
    }
  })

  app.use(unknownEndpoint)
  // errorHandler needs to be the last loaded middleware
  app.use(errorHandler)

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

function requestLogger(req, _res, next) {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

function unknownEndpoint(_req, res) {
  res.status(404).send({ error: 'unknown endpoint' })
}

function errorHandler(error, _req, res, next) {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}
