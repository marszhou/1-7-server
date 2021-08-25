var express = require('express')
const { v4 } = require('uuid')
var router = express.Router()
const { readApiJSON, writeApiJSON, success, error } = require('../common')

router.get('/:feedId', (req, res) => {
  let {feedId}= req.params

  const feeds = readApiJSON('./feeds.json').data
  if (feeds.findIndex(f=>f.id === parseInt(feedId)) === -1) {
    error(res, {message: '没有这个feed。'})
    return
  }

  const file = `comments-${feedId}.json`
  const comments = readApiJSON(file) || {data: []}

  function formatComments(comments) {
    return comments.reduce((ret, comment) => {
      if (!comment.parentId) {
        ret.push(comment)
      } else {
        const find = comments.find(c => c.id === comment.parentId)
        find.children = find.children || []
        find.children.push(comment)
      }
      return ret
    }, [])
  }

  success(res, formatComments(comments.data))
})

router.post('/:feedId', (req, res) => {
  if (!req._user) {
    error(res, {message: '没有登录。'})
    return
  }
  let {parentId, content=''} = req.body
  content = content.trim()

  let {feedId}= req.params

  const feeds = readApiJSON('./feeds.json').data
  if (feeds.findIndex(f=>f.id === parseInt(feedId)) === -1) {
    error(res, {message: '没有这个feed。'})
    return
  }

  const file = `comments-${feedId}.json`

  if (content.length===0) {
    error(res, {message: '缺少内容。'})
    return
  }
  const comments = readApiJSON(file) || {data: []}
  console.log(parentId, comments.data, comments.data.findIndex(c => c.id === parentId))
  if (parentId && comments.data.findIndex(c => c.id === parentId) <0) {
    error(res, {message: '该评论不存在'})
    return
  }

  const comment = {
    user: {id: req._user.id, nickname: req._user.nickname, avatar: req._user.avatar},
    id: v4(),
    parentId,
    content
  }
  comments.data.push(comment)
  writeApiJSON(file, comments)
  success(res, comment)
})

module.exports = router
