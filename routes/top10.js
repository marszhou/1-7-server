var express = require('express')
var router = express.Router()
const { readApiJSON, success } = require('../common')

const h24 = readApiJSON('./24hr.json')
const h72 = readApiJSON('./72hr.json')
const h168 = readApiJSON('./168hr.json')
Object.entries({h24, h72, h168}).forEach(
  ([name, obj]) => {
    router.get('/'+name, (req, res) => {
      success(res, {feeds: obj.data})
    })
  }
)


module.exports = router
