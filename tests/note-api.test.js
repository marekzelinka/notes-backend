import mongoose from 'mongoose'
import assert from 'node:assert'
import { after, beforeEach, test } from 'node:test'
import supertest from 'supertest'
import { app } from '../src/app.js'
import { Note } from '../src/models/note.js'
import { getSavedNotes, initialNotes } from './note-utils.js'

const api = supertest(app)

beforeEach(async () => {
  await Note.deleteMany()
  await Note.insertMany(initialNotes)
})

test('notes are returned as json', async () => {
  const res = await api.get('/api/notes')
  assert.strictEqual(res.status, 200)
  assert.match(res.get('Content-Type'), /application\/json/)
})

test('there are two notes', async () => {
  const res = await api.get('/api/notes')
  assert.strictEqual(res.body.length, initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
  const res = await api.get('/api/notes')
  const contents = res.body.map((note) => note.content)
  assert(contents.includes('HTML is easy'))
})

test('a valid note can be added', async () => {
  const validNoteObject = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  const res = await api.post('/api/notes').send(validNoteObject)
  assert.strictEqual(res.status, 201)
  assert.match(res.get('Content-Type'), /application\/json/)

  const notesAtEnd = await getSavedNotes()
  assert.strictEqual(notesAtEnd.length, initialNotes.length + 1)
  const contents = notesAtEnd.map((note) => note.content)
  assert(contents.includes(validNoteObject.content))
})

test('note without content is not added', async () => {
  const invalidNoteObject = { important: true }

  const res = await api.post('/api/notes').send(invalidNoteObject)
  assert.strictEqual(res.status, 400)

  const notesAtEnd = await getSavedNotes()
  assert.strictEqual(notesAtEnd.length, initialNotes.length)
})

test('a specific note can be added', async () => {
  const notesAtStart = await getSavedNotes()
  const noteToView = notesAtStart[0]

  const res = await api.get(`/api/notes/${noteToView.id}`)
  assert.strictEqual(res.status, 200)
  assert.match(res.get('Content-Type'), /application\/json/)
  assert.deepStrictEqual(res.body, noteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await getSavedNotes()
  const noteToDelete = notesAtStart[0]

  const res = await api.delete(`/api/notes/${noteToDelete.id}`)
  assert.strictEqual(res.status, 204)

  const notesAtEnd = await getSavedNotes()
  const contents = notesAtEnd.map((note) => note.content)
  assert(!contents.includes(noteToDelete.content))
  assert.strictEqual(notesAtEnd.length, initialNotes.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
