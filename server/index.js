const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = require('./router')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/butterfly/static', express.static(__dirname + '/public'))
app.use('/butterfly', router)

app.listen(3000, function () {
  console.log('butterfly app listening on port 3000!')
})
