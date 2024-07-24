import invariant from 'tiny-invariant'

const PORT = process.env.PORT
invariant(PORT, 'Missing PORT env var')

const MONGODB_URI = process.env.MONGODB_URI
invariant(MONGODB_URI, 'Missing MONGODB_URI env var')

export const env = { PORT, MONGODB_URI }
