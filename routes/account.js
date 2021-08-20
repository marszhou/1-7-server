var express = require('express')
const {
  testSignin,
  signUp,
  createSession,
  removeSession,
  getAccountData,
  getSessionData,
  getAccountFromSession,
  refreshSessions,
  clearSession,
} = require('../account')
const app = require('../app')
const { readApiJSON, error, randomKey, success, testCaptcha, writeApiJSON } = require('../common')
const {
  testPhoneFormat,
  testPhoneExists,
  testPasswordFormat,
  testNicknameFormat,
  testNicknameExists,
  testSmsCode,
} = require('../verify')
const fs = require('fs')
const imageThumbnail = require('image-thumbnail')

var router = express.Router()

const accounts = getAccountData()
const sessions = getSessionData()

router.all('/a', (req, res) => {
  req.session.a = 1
  res.json('aaa' +req.session.a )
})

router.all('/b', (req, res) => {
  res.json('bbb'+req.session.a)
})

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
    err.passwd = { message: '密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符' }
  }

  if (nickname.length === 0) {
    err.nickname = { message: '请填写昵称。' }
  } else if (!testNicknameFormat(nickname)) {
    err.nickname = { message: '用户名由字母数字下划线和汉字组成，长度大于等于4小于等于16（汉字宽度按2计算）' }
  } else if (testNicknameExists(accounts.data, nickname)) {
    // console.log(1)
    err.nickname = { message: '该昵称已经有其他人使用。' }
  }
  // console.log(req.session.smsCode)
  if (Object.keys(err).length > 0) {
    error(res, err)
  } else {
    const flag = testSmsCode(req.session, smsCode) // || true
    // remove session
    req.session.smsCode = null
    if (!flag) {
      error(res, { smsCode: { message: '验证码错误，重新请求。' } })
    } else {
      const account = signUp({ phone, passwd, nickname })
      accounts.data.push(account)
      writeApiJSON('./accounts.json', accounts)
      success(res)
    }
  }
})

router.post('/signIn', function (req, res, next) {
  const { phone = '', passwd = '' } = req.body
  const account = testSignin(accounts.data, phone, passwd)
  if (account !== undefined) {
    sessions.data = removeSession(sessions.data, account)
    // console.log('$$$$', account)
    let session = createSession(account)
    sessions.data.push(session)
    writeApiJSON('./sessions.json', sessions)
    success(res, {
      uid: account.id,
      phone: account.phone,
      nickname: account.nickname,
      avatar: account.avatar || {},
      token: session.token,
    })
  } else {
    error(res, { message: '用户不存在，或错误的手机号码或密码。' })
  }
})

router.post('/signOut', function (req, res) {
  if (req._isAuthed) {
    clearSession(req, sessions, req._user.token)
    success(res)
    return
  }
  error(res)
})

router.get('/sendSms', function (req, res) {
  const i = req.url.indexOf('?')
  const queryString = req.url.substr(i + 1)
  const captcha = req.session.captcha
  req.session.captcha = null

  if (testCaptcha(captcha, queryString)) {
    req.session.smsCode = randomKey()
    success(res, req.session.smsCode)
  } else {
    error(res, { message: '非法请求。' })
  }
})

router.post('/avatar', async function (req, res) {
  if (req._isAuthed) {
    if(!(req.files && req.files.avatar)) {
      error(res, {message: '没有上传文件。'})
      return
    }
    const imgDir = fs.realpathSync(__dirname + '/../public/avatars/')
    const account = getAccountFromSession(req._user.token)
    const formats = {
      lg: 512,
      m: 128,
      sm: 64,
      xs: 32,
    }
    const avatar = {}
    const postfix = randomKey(4)
    for (let key in formats) {
      const filename = `${account.id}@${formats[key]}-${postfix}.jpg`
      const thumbnail = await imageThumbnail(req.files.avatar.tempFilePath, {
        width: formats[key],
        height: formats[key],
        fit: 'cover',
      })
      fs.createWriteStream(imgDir+ '/' + filename).write(thumbnail)
      avatar[key] = '/avatars/' + filename
    }
    account.avatar = avatar
    writeApiJSON('./accounts.json', accounts)
    refreshSessions(req, sessions, req._user.token)
    success(res, req._user)
  } else {
    error(res, { message: '禁止访问' })
  }
})

module.exports = router
