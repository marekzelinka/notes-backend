import invariant from 'tiny-invariant'

const NODE_ENV = process.env.NODE_ENV
invariant(NODE_ENV, 'Missing NODE_ENV env var')

const PORT = process.env.PORT
invariant(PORT, 'Missing PORT env var')

const MONGODB_URI = process.env.MONGODB_URI
invariant(MONGODB_URI, 'Missing MONGODB_URI env var')

const SECRET = process.env.SECRET
invariant(SECRET, 'Missing SECRET env var')

export const env = { NODE_ENV, PORT, MONGODB_URI, SECRET }
