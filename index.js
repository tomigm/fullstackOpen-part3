const express = require('express');
const  morgan = require('morgan');
const cors = require('cors')

morgan.token('reqBody', function (req, res) { 
  return JSON.stringify(req.body)
})

const app = express();

app.use(cors())
app.use(express.json());
app.set('view engine', 'pug');
app.use(morgan(":method :url :status :response-time ms - :res[content-length] :reqBody"))
let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = (data) => {
  const maxId = data.length > 0
    ? Math.max(...data.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

function generateUUID4() {
  return Math.abs(Math.random() * 0xFFFFFFFF | 0).toString(36);
}

app.get('/', (request, response) => {
    response.send('<h1>PHONEBOOK</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons);
  })

  app.get('/info', (request, response) => {
    response.render('index', { title: "PERSONS INFO", message:  `Phonebook has info of ${persons.length} persons`, date: `${new Date}` })
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if(person){
      response.render('person', { name: person.name, number:  person.number })

    } else{ 
        response.status(400).send('No persons matching this id');  
    }
    
  })
  
  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
  })


  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    const existingPerson = persons.find(person => person.name === body.name);

    if(existingPerson){
      return response.status(400).json({ 
        error: 'name must be unique!!!' 
      })
    }
    const person = {
      name: body.name,
      important: body.number,
      id: generateUUID4()
    }
    persons = persons.concat(person)

    response.json(person)
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })