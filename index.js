const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('mydata', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :mydata'))

let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('App works!')
})

app.get('/info', (request, response) => {
    const total = persons.length
    const date = new Date()
    response.send(`Phonebook has info for ${total} people <br /> <br /> ${date}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {

    const person = request.body

    const duplicate = persons.find(obj =>
        obj.name.toLowerCase() === person.name.toLowerCase()
    )

    if (person.name && person.number && !duplicate) {

        person.id = Math.floor(Math.random() * 999999)
        persons = persons.concat(person)
        response.json(person)
        
    } else {
        response.status(400).send({ error: 'name must be unique' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
