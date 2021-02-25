const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://user:${password}@cluster0.10skx.mongodb.net/note-app?retryWrites=true`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//   content: "HTML is Easy",
//   date: new Date(),
//   important: true,
// });

// note.save().then(() => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });
Note.find({ important: true }).then((result) => {
  for (const note of result) {
    console.log(note);
  }
  mongoose.connection.close();
});
