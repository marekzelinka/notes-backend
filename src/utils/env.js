import invariant from 'tiny-invariant'

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  SECRET: process.env.SECRET,
}

for (const [label, value] of Object.entries(env)) {
  invariant(value, `Missing ${label} env var`)
}
