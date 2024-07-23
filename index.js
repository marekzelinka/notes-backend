import express from 'express'

const PORT = 3000

let notes = [
  {
    id: '1',
    content: 'HTML is easy',
    important: true,
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
]

function generateNoteId() {
  let maxId = notes.length
    ? Math.max(...notes.map((note) => Number(note.id)))
    : 0
  return String(maxId + 1)
}

express()
  .use(express.json())
  .get('/', (_req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  .get('/api/notes', (_req, res) => {
    res.json(notes)
  })
  .get('/api/notes/:id', (req, res) => {
    let id = req.params.id
    let note = notes.find((note) => note.id === id)

    if (!note) {
      return res.status(404).end()
    }

    res.json(note)
  })
  .delete('/api/notes/:id', (req, res) => {
    let id = req.params.id
    notes = notes.filter((note) => note.id !== id)
    res.status(204).end()
  })
  .post('/api/notes', (req, res) => {
    let { content, important } = req.body

    if (!content) {
      return res.status(400).json({ error: 'content missing' })
    }

    let note = {
      content,
      important: Boolean(important) || false,
      id: generateNoteId(),
    }
    notes = notes.concat(note)
    res.status(201).json(note)
  })
  .listen(PORT, () => console.log(`Server running on port ${PORT}`))
