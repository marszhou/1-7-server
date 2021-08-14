var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  console.log(req.isAuthed, req.user)
  res.render('index', { title: 'chouti server' })
})


module.exports = router
