import * as bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'
import { env } from '../utils/env.js'

export const loginRouter = express.Router()

loginRouter.post('/', async (request, response) => {
  const { username, password: plaintextPassword } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect = !user?.passwordHash
    ? false
    : await bcrypt.compare(plaintextPassword, user.passwordHash)
  if (!passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userFortokenPayload = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(userFortokenPayload, env.SECRET)

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
  })
})
