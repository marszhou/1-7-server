var express = require('express')
var router = express.Router()
var fs = require('fs')

router.get('/', function (req, res, next) {
  console.log(req.isAuthed, req.user)
  res.render('index', { title: 'chouti server' })
})

router.post('/upload', (req, res) => {
  console.log(req.files.foo, fs.realpathSync(__dirname+ '/../public/avatars'))
  req.files.foo.mv(fs.realpathSync(__dirname+ '/../public/avatars/')+'/1.jpg')
  res.send('hei')
})

module.exports = router
