import express from 'express'
import { User } from '../models/user.js'
import { hashPassword } from '../utils/passwords.js'

export const usersRouter = express.Router()

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const passwordHash = await hashPassword(password)
  const user = new User({
    username,
    name,
    passwordHash,
  })
  const savedUser = await user.save()
  res.status(201).send(savedUser)
})

usersRouter.get('/', async (_req, res) => {
  const users = await User.find()
  res.send(users)
})
