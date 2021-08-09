var express = require('express')
var router = express.Router()
const { readApiJSON, writeApiJSON, success } = require('../common')

const readFeeds = () => readApiJSON('./feeds.json')
const writeFeeds = () => writeApiJSON('./feeds.json', feedsData)
const feedsData = readFeeds()
const feeds = feedsData.data

router.get('/count', (req, res) => {
  success(res, {count: feeds.length})
})

router.get('/', (req, res) => {
  const { page = 1 } = req.query
  const pageSize = 10
  const ret = {
    data: {feeds: feeds.slice(page * pageSize, (page + 1) * pageSize),}
  }
  success(res, ret)
})

router.put('/:id/hot', (req, res) => {
  const id = parseInt(req.params.id)
  const feed = feeds.find((f) => f.id === id)
  if (feed) {
    feed.ups += 1
    writeFeeds()
  }
  const ret = { feed }
  success(res, feed)
})

module.exports = router
