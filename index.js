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

express()
  .get('/', (_req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  .get('/api/notes', (_req, res) => {
    res.json(notes)
  })
  .listen(PORT, () => console.log(`Server running on port ${PORT}`))
