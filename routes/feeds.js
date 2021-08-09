var express = require('express')
var router = express.Router()
const { readApiJSON, writeApiJSON } = require('../common')

const readFeeds = () => readApiJSON('./feeds.json')
const writeFeeds = () => writeApiJSON('./feeds.json', feedsData)
const feedsData = readFeeds()
const feeds = feedsData.data

router.get('/count', (req, res) => {
  const ret = {
    data: {count: feeds.length}
  }
  res.json(ret)
})

router.get('/', (req, res) => {
  const { page = 1 } = req.query
  const pageSize = 10
  const ret = {
    data: {feeds: feeds.slice(page * pageSize, (page + 1) * pageSize),}
  }
  res.json(ret)
})

router.update('/:id/hot', (req, res) => {
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
