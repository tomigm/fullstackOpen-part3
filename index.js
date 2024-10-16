require('dotenv').config()
const express = require('express');
const  morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token('reqBody', function (req, res) { 
  return JSON.stringify(req.body)
})

const app = express();


app.use(cors())
app.use(express.json());
app.use(express.static('dist'))
app.set('view engine', 'pug');
app.use(morgan(":method :url :status :response-time ms - :res[content-length] :reqBody"))

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
    const query = Object.fromEntries(
      Object.entries(request.query).filter(([key, value]) => value)
    );

    Person.find(query).then(persons => {
      response.json(persons)
    }).catch(error => next(error))
  })

  app.get('/info', (request, response) => {
    response.render('index', { title: "PERSONS INFO", message:  `Phonebook has info of ${persons.length} persons`, date: `${new Date}` })
  })

  app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
      response.json(person)
    }).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

  })
  
  app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(person => {
      response.status(204).end()
    }).catch(error => next(error))
  })


  app.post('/api/persons', (request, response, next) => {
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
    const person = new Person({
      name: body.name,
      number: body.number
    })
    
    Person.findOne({name: body.name}).then(person => {
      if(person){
        person.number = body.number
        return person.save().then(savedPerson => {
          console.log('Person updated!');
          response.json({savedPerson: savedPerson, type: "updated"});
        });
      } else{
        const person = new Person({
          name: body.name,
          number: body.number
        })        
        return person.save().then(savedPerson => {
          console.log('Person created!');
          response.json(savedPerson);
        });
      }
  
  })
  .catch(error => {
    next(error); // Forward error to middleware for handling
  });

  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    if (!body.name) {
      console.log(body)
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    if (error.name === 'ValidationError') {
      return response.status(400).send({ error: error })
    } 
    next(error)
  }
  
  app.use(unknownEndpoint)
  app.use(errorHandler)
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })


  