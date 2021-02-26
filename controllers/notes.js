const express = require("express");
const Note = require("../models/note");

const notesRouter = express.Router();

notesRouter.get("/", async (_req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

notesRouter.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).end();
  }
  res.json(note);
});

notesRouter.post("/", async (req, res) => {
  const body = req.body;
  const note = new Note({
    content: body.content,
    important: body.important ?? false,
    date: new Date(),
  });
  const savedNote = await note.save();
  res.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (req, res) => {
  await Note.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

notesRouter.put("/:id", async (req, res) => {
  const body = req.body;
  const note = {
    content: body.content,
    important: body.important,
  };
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
  });
  res.json(updatedNote);
});

module.exports = notesRouter;
