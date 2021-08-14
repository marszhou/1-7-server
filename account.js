const md5 = require('md5')
const {v4} = require('uuid')
const secret = 'TRUSTNO1'

function passwdEncode(text) {
  return md5(text + secret)
}

function testSignin(accounts, phone, passwd) {
  console.log(phone, passwd, passwdEncode(passwd))
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
    ...a, token: v4()
  }
}

function removeSession(sessions, account) {
  return sessions.filter(session => session.id !== account.id)
}

module.exports = {
  passwdEncode, testSignin, signUp, createSession, removeSession
}