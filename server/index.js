const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = require('./router')
const fileUpload = require('express-fileupload')
const path = require('path')
const cookieParser = require('cookie-parser')

app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: path.resolve(__dirname, './tmp'),
  debug: false
  // safeFileNames: true,
  // preserveExtension: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/butterfly/static', express.static(__dirname + '/public'))
app.use('/butterfly', router)

app.listen(9421, function () {
  console.log('butterfly app listening on port 9421!')
})
