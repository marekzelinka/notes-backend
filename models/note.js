const mongoose = require("mongoose");
const { Env } = require("@humanwhocodes/env");

const env = new Env();
const { MONGODB_URI } = env.required;

console.log("connecting to", MONGODB_URI);
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log("connected to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB:", error.message));

mongoose.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const noteSchema = new mongoose.Schema({
  content: { type: String, minLength: 5, required: true },
  date: { type: Date, required: true },
  important: { type: Boolean, required: true },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
