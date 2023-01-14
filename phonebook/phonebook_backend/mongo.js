/* eslint-disable no-undef */
const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log('The application should work as follows. You use the program by passing three command-line arguments (the first is the password), e.g.:\nnode mongo.js yourpassword Anna 040-1234556')
  process.exit(1)
} else if (process.argv.length === 3) {
  const password = process.argv[2]

  const url = `mongodb+srv://fullstack:${password}@cluster0.o2jrsxk.mongodb.net/phonebookApp?retryWrites=true&w=majority`

  /* Fetching objects from db */
  mongoose
    .connect(url)
    .then(result => {
      console.log(result)
      console.log('phonebook:')

      Person.find({}).then(result => { // Every entry
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        return mongoose.connection.close()
      })
    })
    .catch((err) => console.log(err))
} else {
  const password = process.argv[2]
  const name = process.argv[3]
  const number = process.argv[4]

  const url = `mongodb+srv://fullstack:${password}@cluster0.o2jrsxk.mongodb.net/phonebookApp?retryWrites=true&w=majority`

  /* Generating new people */
  mongoose
    .connect(url) // establishing connection to the db
    .then(result => {
      console.log(result)
      // Creates new obj using Person model
      const person = new Person({
        name: name,
        number: number,
      })

      // Saving the obj to the db
      return person.save()
    })
    .then(() => { // event handler. Gets called when the obj is saved to the db.
      console.log(`added ${name} number ${number} to phonebook`)
      return mongoose.connection.close() // If connection is not closed, the program will never finish its execution
    })
    .catch((err) => console.log(err))
}
