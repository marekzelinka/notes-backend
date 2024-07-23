import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.error('give password as argument')
  process.exit(1)
}

let password = encodeURIComponent(process.argv[2])

let uri = `mongodb+srv://user:${password}@cluster0.10skx.mongodb.net/notes-backend?retryWrites=true&w=majority&appName=Cluster0`
let clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
}

run().catch(console.dir)

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions)
    await mongoose.connection.db.admin().command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    )

    let noteSchema = new mongoose.Schema({
      content: String,
      important: Boolean,
    })

    let Note = mongoose.model('Note', noteSchema)

    // let note = new Note({ content: 'React is cool', important: false })
    // let result = await note.save()
    // console.log('note saved!', result)

    let notes = await Note.find({ important: true })
    console.log('saved notes')
    for (let note of notes) {
      console.log(note)
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect()
  }
}
