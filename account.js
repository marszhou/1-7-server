const md5 = require('md5')

const secret = 'TRUSTNO1'

export function passwdEncode(text) {
  return md5(text + secret)
}

export function testSignin(accounts, phone, passwd) {
  return accounts.find((account) => account.phone === phone.trim() && account.passwd === passwdEncode(passwd))
}
