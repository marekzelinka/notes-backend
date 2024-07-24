import express from 'express'
import { Note } from '../models/note.js'

export const notesRouter = express.Router()

notesRouter.post('', async (req, res) => {
  const { content, important } = req.body
  const note = new Note({
    content,
    important,
  })
  const savedNote = await note.save()
  res.status(201).send(savedNote)
})

notesRouter.get('/', async (_req, res) => {
  const notes = await Note.find()
  res.send(notes)
})

notesRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const note = await Note.findById(id)

  if (!note) {
    return res.status(404).end()
  }

  res.send(note)
})

notesRouter.put('/:id', async (req, res) => {
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
})

notesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  await Note.findByIdAndDelete(id)
  res.status(204).end()
})
