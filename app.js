const express = require('express')
const app = express()
const port = 3000
const Restaurant = require('./model/restaurant')

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

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurants = restaurantList.results
  const id = req.params.restaurant_id
  const restaurant = restaurants.find(restaurant => restaurant.id === Number(id))
  res.render('show', { restaurant: restaurant})
})

app.get('/search', (req, res) => {
  const restaurants = restaurantList.results
  const keyword = req.query.keyword.trim()
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || 
    restaurant.category.includes(keyword.toLowerCase())
    )
  res.render('index', {restaurants: filteredRestaurants, keyword})
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})