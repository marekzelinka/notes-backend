import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

let app = express()

let notes = [
  {
    id: '1',
    content: 'HTML is easy',
    important: true,
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
]

function generateNoteId() {
  let maxId = notes.length
    ? Math.max(...notes.map((note) => Number(note.id)))
    : 0
  return String(maxId + 1)
}

run().catch(console.dir)

async function run() {
  let clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  }
  await mongoose.connect(MONGODB_URI, clientOptions)
  await mongoose.connection.db.admin().command({ ping: 1 })
  console.log('Pinged your deployment. You successfully connected to MongoDB!')

  let noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })
  noteSchema.set('toJSON', {
    transform: (_doc, ret) => {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
    },
  })

  let Note = mongoose.model('Note', noteSchema)

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

  app.get('/api/notes/:id', (req, res) => {
    let id = req.params.id
    let note = notes.find((note) => note.id === id)

    if (!note) {
      return res.status(404).end()
    }

    res.json(note)
  })

  app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id
    notes = notes.filter((note) => note.id !== id)
    res.status(204).end()
  })

  app.post('/api/notes', (req, res) => {
    let { content, important } = req.body

    if (!content) {
      return res.status(400).json({ error: 'content missing' })
    }

    let note = {
      content,
      important: Boolean(important) || false,
      id: generateNoteId(),
    }
    notes = notes.concat(note)
    res.status(201).json(note)
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
