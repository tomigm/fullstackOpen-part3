require('dotenv').config();
const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI;  if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }

  const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url).then(() => {
    const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

 const person = new Person({
      name: personName, 
      number: personNumber
    })


    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
  
 })
 


 

  
