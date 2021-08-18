var express = require('express')
const { v4 } = require('uuid')
var router = express.Router()
const { readApiJSON, writeApiJSON, success, error } = require('../common')

router.get('/:feedId', (req, res) => {
  let {feedId}= req.params
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
    })
  }

  success(res, formatComments(comments.data))
})

router.post('/:feedId', (req, res) => {
  if (!req._user) {
    error(res, {message: '没有登录。'})
    return
  }

  let {parentId, content=''} = req.body
  let {feedId}= req.params
  const file = `comments-${feedId}.json`

  if (content.length===0) {
    error(res, {message: '缺少内容。'})
    return
  }
  const comments = readApiJSON(file) || {data: []}

  const comment = {
    user: req._user,
    id: v4(),
    parentId,
    content
  }
  comments.data.push(comment)
  writeApiJSON(file, comments)
  success(res, comment)
})


module.exports = router
