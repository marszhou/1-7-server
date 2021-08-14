var express = require('express')
var router = express.Router()
var fs = require('fs')
const imageThumbnail = require('image-thumbnail');

router.get('/', function (req, res, next) {
  console.log(req.isAuthed, req.user)
  res.render('index', { title: 'chouti server' })
})

router.post('/upload', async (req, res) => {
  console.log(req.files.foo, fs.realpathSync(__dirname+ '/../public/avatars'))
  const imgPath = fs.realpathSync(__dirname+ '/../public/avatars/')+'/1.jpg'
  req.files.foo.mv(imgPath)

  try {
      const thumbnail = await imageThumbnail(imgPath, {
        width: 128,
        height: 128,
        fit: 'cover'
      });
      console.log(thumbnail.__proto__, '*****');
      fs.createWriteStream(fs.realpathSync(__dirname+ '/../public/avatars/')+'/1.thumb.jpg').write(thumbnail)
  } catch (err) {
      console.error(err);
  }
  res.send('hei')
})

module.exports = router
