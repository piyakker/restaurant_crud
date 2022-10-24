const express = require('express')
const router = express.Router()

//載入分支路由
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

router.use('/', home)
router.use('/restaurants', restaurants)

//匯出總路由
module.exports = router