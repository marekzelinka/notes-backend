import bcrypt from 'bcrypt'

export async function hashPassword(password) {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  return passwordHash
}

export async function validatePassword(plaintextPassword, passwordHash) {
  const isCorrect = await bcrypt.compare(plaintextPassword, passwordHash)

  return isCorrect
}
