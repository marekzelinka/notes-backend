const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("express-async-errors");
const { MONGODB_URI } = require("./utils/config");
const { logInfo, logError } = require("./utils/logger");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

logInfo("connecting to", MONGODB_URI);
try {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  });
  logInfo("connected to MongoDB");
} catch (error) {
  logError("error connecting to MongoDB:", error.message);
}

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
