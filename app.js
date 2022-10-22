const express = require('express')
const app = express()
const port = 3000
const Restaurant = require('./models/restaurant')

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

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => { res.render('index', { restaurants }) })
    .catch(error => console.log(error))
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const restaurants = restaurantList.results
  const keyword = req.query.keyword.trim()
  const regex = new RegExp(keyword, 'i')
  Restaurant.find({ $or: [{ "name": { $regex: regex } }, { "category": { $regex: regex } }] })
    .lean()
    .then(filteredRestaurants => res.render('index', { restaurants: filteredRestaurants, keyword }))
})

app.get('/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  const newRestaurant = req.body
  return Restaurant.create({
    name: newRestaurant.name,
    name_en: newRestaurant.name_en,
    category: newRestaurant.category,
    image: newRestaurant.image,
    location: newRestaurant.location,
    phone: newRestaurant.phone,
    google_map: newRestaurant.google_map,
    rating: newRestaurant.rating,
    description: newRestaurant.description
  })
  .then(() => {res.redirect('/')})
  .catch(error => console.log(error))
})


app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})