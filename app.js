const express = require('express')
const app = express()
const port = 3000
const Restaurant = require('./models/restaurant')

const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const restaurantList = require('./restaurant.json')
const restaurant = require('./models/restaurant')

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
app.use(methodOverride('_method'))

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
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({
    name: name,
    name_en: name_en,
    category: category,
    image: image,
    location: location,
    phone: phone,
    google_map: google_map,
    rating: rating,
    description: description
  })
  .then(() => {res.redirect('/')})
  .catch(error => console.log(error))
})

app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.put('/restaurants/:restaurant_id', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
  .then(restaurant => {
    restaurant.name= name
    restaurant.name_en= name_en
    restaurant.category= category
    restaurant.image= image
    restaurant.location= location
    restaurant.phone= phone
    restaurant.google_map= google_map
    restaurant.rating= rating
    restaurant.description= description
    restaurant.save()
  })
  .then(() => res.redirect(`/restaurants/${id}`))
  .catch(error => console.log(error))
})

app.delete('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
  .then(restaurant => restaurant.remove())
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
})


app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})