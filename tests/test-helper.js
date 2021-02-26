const Note = require("../models/note");

const initialNotes = [
  { content: "HTML is easy", date: new Date(), important: false },
  {
    content: "Browsers can execute only JavaScript",
    date: new Date(),
    important: true,
  },
];

async function getNonExistingNoteId() {
  const note = new Note({
    content: "willremovesoon",
    date: new Date(),
    important: false,
  });
  await note.save();
  await note.remove();

  return note._id.toString();
}

async function getAllNotes() {
  const notes = await Note.find();
  return notes.map((note) => note.toJSON());
}

module.exports = { initialNotes, getNonExistingNoteId, getAllNotes };
