const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: { type: String, minLength: 5, required: true },
  date: { type: Date, required: true },
  important: { type: Boolean, required: true },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
