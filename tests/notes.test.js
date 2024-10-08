import mongoose from 'mongoose'
import assert from 'node:assert'
import { after, beforeEach, describe, test } from 'node:test'
import supertest from 'supertest'
import { app } from '../src/app.js'
import { Note } from '../src/models/note.js'

const api = supertest(app)

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

describe('when there are initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany()

    await Note.insertMany(initialNotes)
  })

  test('notes are returned as json', async () => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.status, 200)
    assert.match(response.get('Content-Type'), /application\/json/)
  })

  test('all initial notes are returned', async () => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length, initialNotes.length)
  })

  test('a specific note is returned', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map((note) => note.content)
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test('suceeds with status code of 200 if id is valid', async () => {
      const notesBefore = await getInitialNotesFromDb()
      const noteToView = notesBefore[0]

      const response = await api.get(`/api/notes/${noteToView.id}`)
      assert.strictEqual(response.status, 200)
      assert.match(response.get('Content-Type'), /application\/json/)
      assert.deepStrictEqual(response.body, noteToView)
    })

    test('fails with status code of 404 if note is not found', async () => {
      const validId = await getNonExistingValidNoteId()
      const response = await api.get(`/api/notes/${validId}`)
      assert.strictEqual(response.status, 404)
    })

    test('fails with status code of 400 if id is invalid', async () => {
      //  Invalid id, because mongoose expects a ObjectId, and this is a UUID
      const invalidId = '344d251d-35d6-454a-a3ef-cf09f31d316f'

      const response = await api.get(`/api/notes/${invalidId}`)
      assert.strictEqual(response.status, 400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with status code of 201 if data is valid', async () => {
      const validNote = {
        content: 'async/await simplifies making async calls',
      }
      const response = await api.post('/api/notes').send(validNote)
      assert.strictEqual(response.status, 201)
      assert.match(response.get('Content-Type'), /application\/json/)

      const notesAfter = await getInitialNotesFromDb()
      assert.strictEqual(notesAfter.length, initialNotes.length + 1)
      const contents = notesAfter.map((note) => note.content)
      assert(contents.includes(validNote.content))
    })

    test('fails with status code of 400 if content is missing', async () => {
      const invalidNote = { important: true }
      const response = await api.post('/api/notes').send(invalidNote)
      assert.strictEqual(response.status, 400)

      const notesAfter = await getInitialNotesFromDb()
      assert.strictEqual(notesAfter.length, initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with a status of 204 if id is valid', async () => {
      const notesBefore = await getInitialNotesFromDb()
      const noteToDelete = notesBefore[0]

      const response = await api.delete(`/api/notes/${noteToDelete.id}`)
      assert.strictEqual(response.status, 204)

      const notesAfter = await getInitialNotesFromDb()
      assert.strictEqual(notesAfter.length, initialNotes.length - 1)
      const contents = notesAfter.map((note) => note.content)
      assert(!contents.includes(noteToDelete.content))
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})

async function getNonExistingValidNoteId() {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

async function getInitialNotesFromDb() {
  const notes = await Note.find()

  return notes.map((note) => note.toJSON())
}
