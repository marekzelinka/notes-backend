import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'
import { env } from '../utils/env.js'
import { validatePassword } from '../utils/passwords.js'

export const loginRouter = express.Router()

loginRouter.post('/', async (request, response) => {
  const { username, password: plaintextPassword } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect = !user?.passwordHash
    ? false
    : await validatePassword(plaintextPassword, user.passwordHash)
  if (!passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForTokenPayload = {
    username: user.username,
    id: user._id,
  }
  const HOUR_IN_SECONDS = 60 * 60
  const token = jwt.sign(userForTokenPayload, env.SECRET, {
    expiresIn: HOUR_IN_SECONDS,
  })

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
  })
})
