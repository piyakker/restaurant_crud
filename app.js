const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs', helpers: {
  ifCond: function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
  }
} }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(routes)

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
