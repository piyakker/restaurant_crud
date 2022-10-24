const mongoose = require('mongoose')

// 設定若非正式環境，就引入dotenv，便可透過.env取得環境變數
//這條要記得哪有有需要連環境變數，哪裡就要放一個這組if
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})
module.exports = db