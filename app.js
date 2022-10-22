const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const restaurantList = require('./restaurant.json')

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
  const restaurants = restaurantList.results
  res.render('index', {restaurants})
})

app.get('/restaurants/:id', (req, res) => {
  const restaurants = restaurantList.results
  const id = req.params.id
  const restaurant = restaurants.find(restaurant => restaurant.id === Number(id))
  res.render('show', { restaurant: restaurant})
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})