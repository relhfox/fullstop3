const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
    .connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'has to be at least 3 letters long'],
        required: [true, 'is required']
    },
    number: {
        type: String,
        minLength: [9, 'has to be at least 8 digits long'],
        validate: {
            validator: (v) => /^\d{2,3}-\d+$/.test(v),
            message: (props) => `${props.value} is not a valid format. Please try XX-XXXXXX. Only digits allowed.`
        },
        required: [true, 'is required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
