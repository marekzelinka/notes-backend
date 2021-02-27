const express = require("express");
const Note = require("../models/note");
const User = require("../models/user");

const notesRouter = express.Router();

notesRouter.get("/", async (_req, res) => {
  const notes = await Note.find().populate("user", { username: 1, name: 1 });
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
  const { content, important, userId } = req.body;
  const user = await User.findById(userId);
  const note = new Note({
    content,
    important: important ?? false,
    date: new Date(),
    user: user._id,
  });
  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();
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
