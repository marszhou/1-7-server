const md5 = require('md5')
const {v4} = require('uuid')
const { readApiJSON } = require('./common')
const secret = 'TRUSTNO1'
const accounts = readApiJSON('./accounts.json')
const sessions = readApiJSON('./sessions.json')

function getAccountData() { return accounts}
function getSessionData() { return sessions}

function passwdEncode(text) {
  return md5(text + secret)
}

function testSignin(accounts, phone, passwd) {
  return accounts.find((account) => account.phone === phone.trim() && account.passwd === passwdEncode(passwd))
}

function signUp(info) {
  info.passwd = passwdEncode(info.passwd)
  info.id = v4()
  return info
}

function createSession(account) {
  const a = {...account}
  delete a.passwd
  return {
    ...a, token: md5(v4())
  }
}

function middleware_authorization(req, res, next) {
  const token = (req.headers['authorization'] || '').substr(5)
  if (token.length === 32) {
    const session = sessions.data.find(s => s.token === token)
    if (session) {
      req.isAuthed = true
      req.user = session
    }
  }
  next()

}

function removeSession(sessions, account) {
  return sessions.filter(session => session.id !== account.id)
}

module.exports = {
  passwdEncode, testSignin, signUp, createSession, removeSession, getAccountData, getSessionData, middleware_authorization
}