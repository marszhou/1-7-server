var express = require('express')
var router = express.Router()
var fs = require('fs')
var { v4 } = require('uuid')
const { readApiJSON, writeApiJSON, success, error } = require('../common')

const readFeeds = () => readApiJSON('./feeds.json')
const writeFeeds = () => writeApiJSON('./feeds.json', feedsData)
const feedsData = readFeeds()
const feeds = feedsData.data
const nextId = () => {
  return Math.max(...feeds.map((f) => f.id)) + 1
}
const topics = () => {
  return feeds.reduce((topics, feed) => {
    topics[feed.topicId] = feed.topicName
    return topics
  }, {})
}
const newFeed = (title, imgUrl, originalUrl, topicId, topicName, user) => {
  return {
    id: nextId(),
    title,
    imgUrl,
    originalUrl,
    topicId,
    topicName,
    submittedUser: {
      nick: user.nickname,
      id: user.id,
      imgUrl: user.avatar.sm,
    },
    actionTime: Date.now(),
    operateTime: Date.now(),
  }
}

router.get('/count', (req, res) => {
  success(res, { count: feeds.length })
})

router.get('/', (req, res) => {
  let { page } = req.query
  page = parseInt(page) > 0 ? parseInt(page) : 1
  const pageSize = 10
  const ret = {
    feeds: feeds.slice((page - 1) * pageSize, page * pageSize),
    count: feeds.length,
    page,
  }
  success(res, ret)
})

router.get('/:id/related', (req, res) => {
  const id = parseInt(req.params.id)
  const len = (id + '').split('').reduce((a, x) => +x + a, 0) % 5
  let i = (feeds.findIndex((f) => f.id === id) + 100) % feeds.length
  const ret = []
  while (true) {
    if (ret.length >= len) break
    ret.push(feeds[i])
    i = (i + 1) % feeds.length
  }
  success(res, ret)
})

router.post('/', (req, res) => {
  if (!req._user) {
    error(res, { message: '没有登录。' })
    return
  }
  let { title, originalUrl, topicId } = req.body
  title = title.trim()
  originalUrl = originalUrl.trim()
  topicId = parseInt(topicId) || 0
  console.log(topics())
  let topicName = topics()[topicId]
  if (!(title)) {
    error(res, { message: '标题必须填写' })
    return
  }
  if (!topicName) {
    error(res, { message: '必须选择有效的话题' })
    return
  }

  const file = (req.files || {}).img
  let imgUrl = ''
  try {
    fs.mkdirSync(__dirname + '/../public/avatars/uploads')
  } catch {}

  if (file) {
    const ext = file.name.substr(file.name.lastIndexOf('.')).toLowerCase()
    if (['.jpeg', '.jpg', '.webp', '.png', '.gif'].indexOf(ext) > -1) {
      imgUrl = `/avatars/uploads/${v4()}${ext}`
      file.mv(__dirname + '/../public' + imgUrl)
    }
  }
  imgUrl = imgUrl.trim()
  if (!imgUrl) {
    error(res, { message: '图片必须填写。' })
    return
  }

  const feed = newFeed(title, imgUrl, originalUrl, topicId, topicName, req._user)
  feeds.unshift(feed)
  writeFeeds()
  success(res, feed)
})

router.put('/:id', (req, res) => {
  if (!req._user) {
    error(res, { message: '没有登录。' })
    return
  }
  let id = parseInt(req.params.id)

  let feed = feeds.find((f) => f.id === id)
  if (!feed) {
    error(res, { message: '不存在此feed。' })
    return
  }
  if (feed.submittedUser.id !== req._user.id) {
    error(res, { message: '无权操作此feed。' })
    return
  }

  let { title, originalUrl, topicId } = req.body
  title = title.trim()
  originalUrl = originalUrl.trim()
  topicId = parseInt(topicId) || 0
  let topicName = topics()[topicId]
  if (!(title)) {
    error(res, { message: '标题必须填写' })
    return
  }
  if (!topicName) {
    error(res, { message: '必须选择有效的话题' })
    return
  }

  const file = (req.files || {}).img
  let imgUrl = ''
  try {
    fs.mkdirSync(__dirname + '/../public/avatars/uploads')
  } catch {}

  if (file) {
    const ext = file.name.substr(file.name.lastIndexOf('.')).toLowerCase()
    if (['.jpeg', '.jpg', '.webp', '.png', '.gif'].indexOf(ext) > -1) {
      imgUrl = `/avatars/uploads/${v4()}${ext}`
      file.mv(__dirname + '/../public' + imgUrl)
    }
  }
  imgUrl = imgUrl.trim() || feed.imgUrl

  Object.assign(feed, {
    title,
    originalUrl,
    imgUrl,
    topicId,
    topicName,
  })

  writeFeeds()
  success(res, feed)
})

router.delete('/:id', (req, res) => {
  if (!req._user) {
    error(res, { message: '没有登录。' })
    return
  }

  let id = parseInt(req.params.id)
  let feedIndex = feeds.findIndex((f) => f.id === id)
  if (feedIndex === -1) {
    error(res, { message: '不存在此feed。' })
    return
  }

  if (feed.user.id !== req._user.id) {
    error(res, { message: '无权操作此feed。' })
    return
  }

  feeds.splice(feedIndex, 1)

  writeFeeds()
  success(res)
})

router.get('/:id', (req, res)=> {
  const id= parseInt(req.params.id)
  const feed = feeds.find(feed => feed.id === id)
  if (feed) {
    success(res, feed)
  } else {
    error(res, {message: 'feed 不存在。'})
  }
})

module.exports = router
