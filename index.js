require("dotenv").config();
const { Env } = require("@humanwhocodes/env");
const express = require("express");
const cors = require("cors");
const Note = require("./models/note");

const env = new Env();
const { PORT } = env.required;

const app = express();
app.use(express.static("build"));
app.use(express.json());
app.use(cors());

function logger(req, _res, next) {
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  console.log("---");
  next();
}
app.use(logger);

app.get("/api/notes", (_req, res, next) => {
  Note.find()
    .then((notes) => {
      res.json(notes);
    })
    .catch((error) => next(error));
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        return res.status(404).end();
      }
      res.json(note);
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (req, res, next) => {
  const body = req.body;
  const note = new Note({
    content: body.content,
    important: body.important ?? false,
    date: new Date(),
  });
  note
    .save()
    .then((savedNote) => {
      res.status(201).json(savedNote);
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
  const body = req.body;
  const note = {
    content: body.content,
    important: body.important,
  };
  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

function unknownEndpoint(_req, res) {
  res.status(404).end();
}
app.use(unknownEndpoint);

function errorHandler(error, _req, res, next) {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
}
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
