import express from 'express'
import { Note } from '../models/note.js'
import { User } from '../models/user.js'

export const notesRouter = express.Router()

notesRouter.post('/', async (request, response) => {
  const { userId, content, important } = request.body

  const user = await User.findById(userId)

  const note = new Note({
    content,
    important,
    user: user.id,
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

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

  const updates = {
    content,
    important: Boolean(important) || false,
  }
  const updatedNote = await Note.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  response.send(updatedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  await Note.findByIdAndDelete(id)

  response.status(204).end()
})
