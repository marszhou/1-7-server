const md5 = require('md5')
const {v4} = require('uuid')
const secret = 'TRUSTNO1'

function passwdEncode(text) {
  return md5(text + secret)
}

function testSignin(accounts, phone, passwd) {
  return accounts.find((account) => account.phone === phone.trim() && account.passwd === passwdEncode(passwd))
}

function signUp(info) {
  info.passwd = md5(info.passwd + secret)
  info.id = v4()
  return info
}

module.exports = {
  passwdEncode, testSignin, signUp
}