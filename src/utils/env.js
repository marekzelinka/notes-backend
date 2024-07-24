import invariant from 'tiny-invariant'

const NODE_ENV = process.env.NODE_ENV
invariant(NODE_ENV, 'Missing NODE_ENV env var')

const PORT = process.env.PORT
invariant(PORT, 'Missing PORT env var')

let MONGODB_URI = process.env.MONGODB_URI
invariant(MONGODB_URI, 'Missing MONGODB_URI env var')

if (NODE_ENV === 'test') {
  const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI
  invariant(TEST_MONGODB_URI, 'Missing TEST_MONGODB_URI env var')

  MONGODB_URI = TEST_MONGODB_URI
}

export const env = { NODE_ENV, PORT, MONGODB_URI }
