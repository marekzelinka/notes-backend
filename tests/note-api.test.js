import mongoose from 'mongoose'
import assert from 'node:assert'
import { after, beforeEach, describe, test } from 'node:test'
import supertest from 'supertest'
import { app } from '../src/app.js'
import { Note } from '../src/models/note.js'
import {
  getNonexistingValidNoteId,
  getSavedNotes,
  initialNotes,
} from './note-test-utils.js'

const api = supertest(app)

describe('when there are initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany()
    await Note.insertMany(initialNotes)
  })

  test('notes are returned as json', async () => {
    const res = await api.get('/api/notes')
    assert.strictEqual(res.status, 200)
    assert.match(res.get('Content-Type'), /application\/json/)
  })

  test('all initial notes are returned', async () => {
    const res = await api.get('/api/notes')
    assert.strictEqual(res.body.length, initialNotes.length)
  })

  test('a specific note is returned', async () => {
    const res = await api.get('/api/notes')
    const contents = res.body.map((note) => note.content)
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test('suceeds with status code of 200 if id is valid', async () => {
      const notesBefore = await getSavedNotes()
      const noteToView = notesBefore[0]

      const res = await api.get(`/api/notes/${noteToView.id}`)
      assert.strictEqual(res.status, 200)
      assert.match(res.get('Content-Type'), /application\/json/)
      assert.deepStrictEqual(res.body, noteToView)
    })

    test('fails with status code of 404 if note is not found', async () => {
      const validId = await getNonexistingValidNoteId()

      const res = await api.get(`/api/notes/${validId}`)
      assert.strictEqual(res.status, 404)
    })

    test('fails with status code of 400 if id is invalid', async () => {
      //  Invalid id, because MonogoDB expects a ObjectId, and this is a UUID
      const invalidId = '344d251d-35d6-454a-a3ef-cf09f31d316f'

      const res = await api.get(`/api/notes/${invalidId}`)
      assert.strictEqual(res.status, 400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with status code of 201 if data is valid', async () => {
      const validNoteObject = {
        content: 'async/await simplifies making async calls',
      }

      const res = await api.post('/api/notes').send(validNoteObject)
      assert.strictEqual(res.status, 201)
      assert.match(res.get('Content-Type'), /application\/json/)

      const notesAfter = await getSavedNotes()
      assert.strictEqual(notesAfter.length, initialNotes.length + 1)
      const contents = notesAfter.map((note) => note.content)
      assert(contents.includes(validNoteObject.content))
    })

    test('fails with status code of 400 if content is missing', async () => {
      const invalidNoteObject = { important: true }

      const res = await api.post('/api/notes').send(invalidNoteObject)
      assert.strictEqual(res.status, 400)

      const notesAfter = await getSavedNotes()
      assert.strictEqual(notesAfter.length, initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with a status of 204 if id is valid', async () => {
      const notesBefore = await getSavedNotes()
      const noteToDelete = notesBefore[0]

      const res = await api.delete(`/api/notes/${noteToDelete.id}`)
      assert.strictEqual(res.status, 204)

      const notesAfter = await getSavedNotes()
      assert.strictEqual(notesAfter.length, initialNotes.length - 1)
      const contents = notesAfter.map((note) => note.content)
      assert(!contents.includes(noteToDelete.content))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
