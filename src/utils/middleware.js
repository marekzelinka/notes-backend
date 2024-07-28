import { logError, logInfo } from './logger.js'

export function requestLogger(request, _response, next) {
  logInfo('Method:', request.method)
  logInfo('Path:  ', request.path)
  logInfo('Body:  ', request.body)
  logInfo('---')
  next()
}

export function unknownEndpoint(_request, response) {
  response.status(404).send({ error: 'unknown endpoint' })
}

export function errorHandler(error, _request, response, next) {
  logError(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    const property = Object.keys(error.keyValue)[0]
    return response.status(400).send({ error: `${property} must be unique` })
  }

  next(error)
}
