function requestLogger(req, _res, next) {
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  console.log("---");
  next();
}

function unknownEndpoint(_req, res) {
  res.status(404).end();
}

function errorHandler(error, _req, res, next) {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
}

module.exports = { requestLogger, unknownEndpoint, errorHandler };
