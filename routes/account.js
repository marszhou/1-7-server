var express = require('express')
const { testSignin } = require('../account')
const { readApiJSON } = require('../common')
var router = express.Router()

const accounts = readApiJSON('./accounts.json')
const sessions = readApiJSON('./sessions.json')

/* GET users listing. */
router.post('/signUp', function (req, res, next) {})

router.post('/signIn', function (req, res, next) {
  const { phone = '', passwd = '' } = req.query
  const account = testSignin(phone, passwd)
  if (account !== undefined) {
    // create session
  }
})

router.get('/signOut', function (req, res) {})

module.exports = router
