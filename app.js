const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { MONGODB_URI } = require("./utils/config");
const { logInfo, logError } = require("./utils/logger");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");
const notesRouter = require("./controllers/notes");

const app = express();

logInfo("connecting to", MONGODB_URI);
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => logInfo("connected to MongoDB"))
  .catch((error) => logError("error connecting to MongoDB:", error.message));

mongoose.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);
app.use("/api/notes", notesRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
