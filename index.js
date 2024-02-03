require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

morgan.token('mydata', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :mydata'))


app.get('/', (request, response) => {
    response.send('App works!')
})

app.get('/info', (request, response) => {
    const total = persons.length
    const date = new Date()
    response.send(`Phonebook has info for ${total} people <br /> <br /> ${date}`)
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons)
        })
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

    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    /*
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
    */
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
