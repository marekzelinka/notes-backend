import express from 'express'
import jwt from 'jsonwebtoken'
import { Note } from '../models/note.js'
import { User } from '../models/user.js'
import { env } from '../utils/env.js'

export const notesRouter = express.Router()

notesRouter.post('/', async (request, response) => {
  const { content, important } = request.body

  const decodedToken = jwt.verify(extractTokenFromRequest(request), env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).send({
      error: 'token invalid',
    })
  }

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content,
    important,
    user: user._id,
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).send(savedNote)
})

function extractTokenFromRequest(request) {
  const authHeader = request.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  return authHeader.replace('Bearer ', '')
}

notesRouter.get('/', async (_request, response) => {
  const notes = await Note.find().populate('user', {
    username: 1,
    name: 1,
  })

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
