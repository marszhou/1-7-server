var express = require('express')
const { v4 } = require('uuid')
var router = express.Router()
const { readApiJSON, writeApiJSON, success, error } = require('../common')

router.post('/:feedId', (req, res) => {
  if (!req._user) {
    error(res, { message: '没有登录。' })
    return
  }

  const feeds = readApiJSON('./feeds.json').data
  let feedId = parseInt(req.params.feedId)
  let feedIndex = feeds.findIndex((f) => f.id === feedId)
  if (feedIndex === -1) {
    error(res, { message: '不存在此feed。' })
    return
  }

  const file = `favorite-${req._user.id}.json`
  const favorites = readApiJSON(file) || { data: [] }
  if (favorites.data.indexOf(id) > -1) {
    favorites.data = favorites.data.filter((faovriteFeedId) => faovriteFeedId !== feedId)
  } else {
    favorites.data.push(id)
  }
  writeApiJSON(file, favorites)

  success(res)
})

router.get('/', (req, res) => {
  if (!req._user) {
    error(res, { message: '没有登录。' })
    return
  }

  const feeds = readApiJSON('./feeds.json').data
  const file = `favorite-${req._user.id}.json`
  const favorites = readApiJSON(file) || { data: [] }

  const favoriteFeeds = favorites.data.reduce((ret, feedId) => {
    const feed = feeds.find(f => f.id === feedId)
    if (feed) {
      ret = [...ret, feed]
    }
    return ret
  }, [])
  success(res, favoriteFeeds)
})

module.exports = router