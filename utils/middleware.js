const { logInfo, logError } = require("./logger");

function requestLogger(req, _res, next) {
  logInfo(`Method: ${req.method}`);
  logInfo(`Path: ${req.path}`);
  logInfo(`Body: ${JSON.stringify(req.body)}`);
  logInfo("---");
  next();
}

function unknownEndpoint(_req, res) {
  res.status(404).end();
}

function errorHandler(error, _req, res, next) {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  }
  logError(error.message);
  next(error);
}

module.exports = { requestLogger, unknownEndpoint, errorHandler };
