const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: { type: String, minLength: 5, required: true },
  date: { type: Date, required: true },
  important: { type: Boolean, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

noteSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
