import { logError, logInfo } from './logger.js'

export function requestLogger(req, _res, next) {
  logInfo('Method:', req.method)
  logInfo('Path:  ', req.path)
  logInfo('Body:  ', req.body)
  logInfo('---')
  next()
}

export function unknownEndpoint(_req, res) {
  res.status(404).send({ error: 'unknown endpoint' })
}

export function errorHandler(error, _req, res, next) {
  logError(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}