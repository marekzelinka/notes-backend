import mongoose from 'mongoose'
import assert from 'node:assert'
import { after, test } from 'node:test'
import supertest from 'supertest'
import { app } from '../src/app.js'

const api = supertest(app)

test('notes are returned as json', async () => {
  const res = await api.get('/api/notes')
  assert.strictEqual(res.status, 200)
  assert.match(res.get('Content-Type'), /application\/json/)
})

test('there are two notes', async () => {
  const res = await api.get('/api/notes')
  assert.strictEqual(res.body.length, 2)
})

test('the first note is about HTTP methods', async () => {
  const res = await api.get('/api/notes')
  const contents = res.body.map((note) => note.content)
  assert(contents.includes('HTML is easy'))
})

after(async () => {
  await mongoose.connection.close()
})
