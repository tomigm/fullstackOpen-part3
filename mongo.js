const mongoose = require('mongoose')
  
  if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }

  const password = process.argv[2]

const url =
  `mongodb+srv://admin:${password}@cluster0.bob7p.mongodb.net/personsApp?retryWrites=true&w=majority&appName=Cluster0`

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
 


 

  
