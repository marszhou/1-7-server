const md5 = require('md5')
const {v4} = require('uuid')
const { readApiJSON, writeApiJSON } = require('./common')
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
  info.avatar = {
    lg: '/avatars/avatar@512.png',
    m: '/avatars/avatar@128.png',
    sm: '/avatars/avatar@64.png',
    xs: '/avatars/avatar@32.png',
  }
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
      req._isAuthed = true
      req._user = session
    }
  }
  next()

}

function removeSession(sessions, account) {
  return sessions.filter(session => session.id !== account.id)
}

function getAccountFromSession(token) {
  const session = sessions.data.find(s => s.token === token)
  if(session) {
    return accounts.data.find(a => a.id === session.id)
  }
}

function refreshSessions(req, sessions, token) {
  const account = getAccountFromSession(token)
  const copy = {... account}
  delete copy.passwd
  const index = sessions.data.findIndex(s => s.token === token)
  Object.assign(sessions.data[index], copy)
  writeApiJSON('./sessions.json', sessions)
  req._user = sessions.data[index]
}

function clearSession(req, sessions, token) {
  sessions.data = sessions.data.filter(s => s.token !== token)
  writeApiJSON('./sessions.json', sessions)
  req._user = undefined
  req._isAuthed = undefined
}

module.exports = {
  passwdEncode, testSignin, signUp, createSession, removeSession, clearSession, getAccountData, getSessionData, middleware_authorization, getAccountFromSession, refreshSessions
}