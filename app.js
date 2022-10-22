const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const restaurant = require('./restaurant.json')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
})

app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}))
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.get('/', (req, res) => {
  const restaurants = restaurant.results
  res.render('index', {restaurants})
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})