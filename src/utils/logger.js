import { env } from './env'

export function logInfo(...params) {
  if (env.NODE_ENV === 'test') {
    return
  }

  console.log(...params)
}

export function logError(...params) {
  if (env.NODE_ENV === 'test') {
    return
  }

  console.error(...params)
}
