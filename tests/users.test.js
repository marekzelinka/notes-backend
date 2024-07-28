import mongoose from 'mongoose'
import assert from 'node:assert'
import { after, beforeEach, describe, test } from 'node:test'
import supertest from 'supertest'
import { app } from '../src/app.js'
import { User } from '../src/models/user.js'
import { hashPassword } from '../src/utils/passwords.js'

const api = supertest(app)

const initialUser = {
  username: 'root',
  password: 'sekret',
}

describe('when there is initially one user saved', () => {
  beforeEach(async () => {
    await User.deleteMany()

    const passwordHash = await hashPassword(initialUser.password)
    const user = new User({
      username: initialUser.username,
      passwordHash,
    })
    await user.save()
  })

  describe('addition of a new user', () => {
    test('suceeds with status code of 201 if username is unique', async () => {
      const usersBefore = await getInitialUsersFromDb()

      const validUser = {
        username: 'mluukkai',
        name: 'Matti Lukkainen',
        password: 'salainen',
      }
      const response = await api.post('/api/users').send(validUser)
      assert.strictEqual(response.status, 201)
      assert.match(response.get('Content-Type'), /application\/json/)

      const usersAfter = await getInitialUsersFromDb()
      assert.strictEqual(usersAfter.length, usersBefore.length + 1)
      const usernames = usersAfter.map((user) => user.username)
      assert(usernames.includes(validUser.username))
    })

    test('fails with status code of 400 if username is taken', async () => {
      const usersBefore = await getInitialUsersFromDb()

      // Username is not unique
      const invalidUser = {
        username: 'root',
        password: '123456',
      }
      const response = await api.post('/api/users').send(invalidUser)
      assert.strictEqual(response.status, 400)
      assert.match(response.get('Content-Type'), /application\/json/)
      assert.match(response.body.error, /username must be unique/i)

      const usersAfter = await getInitialUsersFromDb()
      assert.strictEqual(usersAfter.length, usersBefore.length)
    })

    test('fails with status code of 400 if username is too short', async () => {
      const usersBefore = await getInitialUsersFromDb()

      // Username is too short, must be at least 3 chars
      const invalidUser = {
        username: 'e',
        password: '123456',
      }
      const response = await api.post('/api/users').send(invalidUser)
      assert.strictEqual(response.status, 400)
      assert.match(response.get('Content-Type'), /application\/json/)
      assert.match(response.body.error, /Username is too short/i)

      const usersAfter = await getInitialUsersFromDb()
      assert.strictEqual(usersAfter.length, usersBefore.length)
    })

    test('fails with status code of 400 if username does not match criteria', async () => {
      const usersBefore = await getInitialUsersFromDb()

      // Invalid, beacuse username includes 2 dashes (_) after one another and
      // a dot (.) at the end
      const invalidUser = {
        username: 'm_luukk__ai.',
        password: '123456',
      }
      const response = await api.post('/api/users').send(invalidUser)
      assert.strictEqual(response.status, 400)
      assert.match(response.get('Content-Type'), /application\/json/)
      assert.match(response.body.error, /Username is not valid/i)

      const usersAfter = await getInitialUsersFromDb()
      assert.strictEqual(usersAfter.length, usersBefore.length)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})

async function getInitialUsersFromDb() {
  const users = await User.find()

  return users.map((user) => user.toJSON())
}
