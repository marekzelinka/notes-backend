import express from 'express'
import { Note } from '../models/note.js'

export const notesRouter = express.Router()

notesRouter.post('', async (request, response) => {
  const { content, important } = request.body
  const note = new Note({
    content,
    important,
  })
  const savedNote = await note.save()
  response.status(201).send(savedNote)
})

notesRouter.get('/', async (_request, response) => {
  const notes = await Note.find()
  response.send(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const note = await Note.findById(id)

  if (!note) {
    return response.status(404).end()
  }

  response.send(note)
})

notesRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { content, important } = request.body
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
  response.send(updatedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Note.findByIdAndDelete(id)
  response.status(204).end()
})
