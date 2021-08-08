var express = require('express')
var router = express.Router()
var fs = require('fs')
const { readApiJSON, writeApiJSON } = require('../common')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/json/:j?', (req, res) => {
  console.log(req.params.j)
  const data = fs.readFileSync(process.cwd() + '/fake-api/24hr.json', { encoding: 'utf8', flag: 'r' })
  fs.writeFileSync(process.cwd() + '/fake-api/2hr.json', '{a:1}', {
    encoding: 'UTF-8',
    flag: 'w',
  })

  res.send(data)
})

const readFeeds = () => readApiJSON('./feeds.json')
const writeFeeds = () => writeApiJSON('./feeds.json', feedsData)
const feedsData = readFeeds()
const feeds = feedsData.data

router.get('/feeds', (req, res) => {
  const { page = 1 } = req.query
  const pageSize = 10
  const ret = {
    feeds: feeds.slice(page * pageSize, (page + 1) * pageSize),
  }
  res.json(ret)
})

router.get('/feeds/count', (req, res) => {
  const ret = {
    count: feeds.length,
  }
  res.json(ret)
})

router.get('/feeds/:id/hot', (req, res) => {
  const id = parseInt(req.params.id)
  const feed = feeds.find((f) => f.id === id)
  if (feed) {
    feed.ups += 1
    writeFeeds()
  }
  const ret = { feed }
  res.json(ret)
})

module.exports = router
