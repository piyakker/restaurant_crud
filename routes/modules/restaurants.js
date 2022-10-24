const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

//取得新增餐廳的表單頁面
router.get('/new', (req, res) => {
  res.render('new')
})

//查詢符合關鍵字的餐廳
//透過取回的排序的屬性和值來 sort
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const [property, sortBy] = req.query.sort.split('_')
  const regex = new RegExp(keyword, 'i')
  Restaurant.find({ $or: [{ "name": { $regex: regex } }, { "category": { $regex: regex } }] })
    .lean()
    .sort({ [property]: sortBy })
    .then(filteredRestaurants => res.render('index', { restaurants: filteredRestaurants, keyword }))
})

//瀏覽特定餐廳
router.get('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

//新增餐廳
router.post('/', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => { res.redirect('/') })
    .catch(error => console.log(error))
})

router.get('/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

//修改特定餐廳資料
router.put('/:restaurant_id', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//刪除特定餐廳
router.delete('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router