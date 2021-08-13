function testPhoneFormat(phone) {
  return /^1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(phone)
}

function testPasswordFormat(password) {
  return /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/.test(password)
}

function testPhoneExists(accounts, phone) {
  return accounts.some((account) => account['phone'] === phone)
}

function computedStrLen(str) {
  var len = 0
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i)
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
  }
  return len
}

function testNicknameFormat(nickname) {
  return /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(nickname) && computedStrLen(nickname) <= 16 && computedStrLen(nickname) >= 4
}

function testNicknameExists(accounts, nickname) {
  return accounts.some((account) => account.nickname.toUpperCase() === nickname.toUpperCase())
}

function testSmsCode(session, code) {
  return session.smsCode === code
}

module.exports = {testPhoneExists, testNicknameExists, testNicknameFormat, testPasswordFormat, testPhoneExists, testPhoneFormat, testSmsCode}