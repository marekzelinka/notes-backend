import express from 'express'
import { User } from '../models/user.js'
import { hashPassword } from '../utils/passwords.js'

export const usersRouter = express.Router()

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const passwordHash = await hashPassword(password)
  const user = new User({
    username,
    name,
    passwordHash,
  })
  const savedUser = await user.save()

  response.status(201).send(savedUser)
})

usersRouter.get('/', async (_request, response) => {
  const users = await User.find()

  response.send(users)
})
