const express = require("express");
const jwt = require("jsonwebtoken");
const Note = require("../models/note");
const User = require("../models/user");
const { SECRET } = require("../utils/config");

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

function getToken(req) {
  const auth = req.get("authorization");
  if (auth === undefined) {
    return null;
  } else if (!auth.startsWith("Bearer ")) {
    return null;
  }
  return auth.substring(7);
}

notesRouter.post("/", async (req, res) => {
  const { content, important } = req.body;
  const token = getToken(req);
  const decodedToken = jwt.verify(token, SECRET);
  if (token === null || decodedToken.id === undefined) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);
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
