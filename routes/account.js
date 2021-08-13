var express = require('express')
const { testSignin, signUp } = require('../account')
const { readApiJSON, error, randomKey, success, testCaptcha, writeApiJSON } = require('../common')
const { testPhoneFormat, testPhoneExists, testPasswordFormat, testNicknameFormat, testNicknameExists, testSmsCode } = require('../verify')
var router = express.Router()

const accounts = readApiJSON('./accounts.json')
const sessions = readApiJSON('./sessions.json')

/* GET users listing. */
router.post('/signUp', function (req, res, next) {
  let { phone = '', passwd = '', smsCode = '', nickname = '' } = req.body
  phone = phone.trim()
  passwd = passwd.trim()
  smsCode = smsCode.trim()
  nickname = nickname.trim()

  const err = {}
  if (phone.length === 0) {
    err.phone = { message: '请填写手机号。' }
  } else if (!testPhoneFormat(phone)) {
    err.phone = { message: '请输入有效的手机号。' }
  } else if (testPhoneExists(accounts.data, phone)) {
    err.phone = { message: '该手机号已经注册过了。' }
  }

  if (passwd.length === 0) {
    err.passwd = { message: '请填写密码。' }
  } else if (!testPasswordFormat(passwd)) {
    err.passwd = { message: '密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符'}
  }

  if (nickname.length === 0) {
    err.nickname = { message: '请填写昵称。' }
  } else if (!testNicknameFormat(nickname)) {
    err.nickname = { message: '用户名由字母数字下划线和汉字组成，长度大于等于4小于等于16（汉字宽度按2计算）'}
  } else if (testNicknameExists(accounts.data, nickname)) {
    err.nickname = { message: '该昵称已经有其他人使用。'}
  }
  // console.log(req.session.smsCode)
  if (Object.keys(err).length > 0) {
    error(res, err)
  } else {
    const flag = testSmsCode(req.session, smsCode)
    // remove session
    // req.session.smsCode = null
    if (!flag) {
      error(res, {smsCode: {message: '验证码错误，重新请求。'}})
    } else{
      const account = signUp({phone, passwd, nickname})
      accounts.data.push(account)
      writeApiJSON('./accounts.json', accounts)
      success(res, accounts.data)
    }
  }
})

router.post('/signIn', function (req, res, next) {
  const { phone = '', passwd = '' } = req.query
  const account = testSignin(phone, passwd)
  if (account !== undefined) {
    // create session
  }
})

router.get('/signOut', function (req, res) {})

router.get('/sendSms', function (req, res) {
  const i = req.url.indexOf('?')
  const queryString = req.url.substr(i+1);
  const captcha = req.session.captcha
  req.session.captcha = null

  if(testCaptcha(captcha, queryString)) {
    req.session.smsCode = randomKey()
    success(res, req.session.smsCode)
  } else {
    error(res, {message: '非法请求。'})
  }
})

// router.get('/a', function(req, res) {
//   req.session.a = '123'
//   success(res, null)
// })

// router.get('/b', function(req, res) {
//   success(res, req.session.a)
// })

module.exports = router
