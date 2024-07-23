import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { Note } from './models/note.js'

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

let app = express()

run().catch(console.dir)

async function run() {
  let clientOptions = {
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

  app.get('/api/notes', async (_req, res) => {
    let notes = await Note.find()
    res.json(notes)
  })

  app.get('/api/notes/:id', async (req, res) => {
    let noteId = req.params.id
    let note = await Note.findById(noteId)

    if (!note) {
      return res.status(404).end()
    }

    res.json(note)
  })

  app.delete('/api/notes/:id', async (req, res) => {
    let noteId = req.params.id
    await Note.findByIdAndDelete(noteId)
    res.status(204).end()
  })

  app.post('/api/notes', async (req, res) => {
    let { content, important } = req.body

    if (!content) {
      return res.status(400).json({ error: 'content missing' })
    }

    let note = new Note({
      content,
      important: Boolean(important) || false,
    })
    let savedNote = await note.save()

    res.status(201).json(savedNote)
  })

  app.use(unknownEndpoint)

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
  res.status(404).json({ error: 'unknown endpoint' })
}
