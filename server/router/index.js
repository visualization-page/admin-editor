const express = require('express')
const router = express.Router()
const components = require('./components')
const dayjs = require('dayjs')

router.use(function timeLog (req, res, next) {
  console.log('%s %s %s %s', dayjs().format('YYYY/MM/DD HH:mm:ss'), req.method, req.url, req.path)
  next()
})

Object.keys(components).forEach(path => {
  const properties = components[path]
  const route = router.route(path)
  Object.keys(properties).forEach(method => {
    route[method]((req, res, next) => {
      properties[method](req, res, next).catch((e) => {
        res.json({ success: false, msg: e.message })
      })
    })
  })
})

module.exports = router
