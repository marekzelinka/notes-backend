import express from 'express'
import { Note } from '../models/note.js'

export const notesRouter = express.Router()

notesRouter.post('', async (req, res, next) => {
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

notesRouter.get('/', async (_req, res, next) => {
  try {
    const notes = await Note.find()
    res.send(notes)
  } catch (error) {
    next(error)
  }
})

notesRouter.get('/:id', async (req, res, next) => {
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

notesRouter.put('/:id', async (req, res, next) => {
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

notesRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    await Note.findByIdAndDelete(id)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})
