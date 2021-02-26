const express = require("express");
const Note = require("../models/note");

const notesRouter = express.Router();

notesRouter.get("/", (_req, res, next) => {
  Note.find()
    .then((notes) => {
      res.json(notes);
    })
    .catch((error) => next(error));
});

notesRouter.get("/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        return res.status(404).end();
      }
      res.json(note);
    })
    .catch((error) => next(error));
});

notesRouter.post("/", (req, res, next) => {
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

notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

notesRouter.put("/:id", (req, res, next) => {
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

module.exports = notesRouter;
