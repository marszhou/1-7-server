const fs = require('fs')

const jsonPath = process.cwd() + '/fake-api/'
const readApiJSON = (path) => {
  const filePath = jsonPath + path
  const data = fs.readFileSync(filePath, { encoding: 'utf-8', flag: 'r' })
  return JSON.parse(data)
}
const writeApiJSON = (path, data) => {
  fs.writeFileSync(process.cwd() + '/fake-api/' + path, JSON.stringify(data), {
    encoding: 'UTF-8',
    flag: 'w',
  })
}
const success = (res, data) => res.json({ data, ok: true })
const error = (res, error) => res.json({ error, ok: false })

const testCaptcha = (captcha, text) => {
  const expires = 100000
  if (!captcha) return false
  if (Date.now() - captcha.ts > expires) return false
  return captcha.text.toUpperCase() === text.toUpperCase()
}

module.exports = { jsonPath, readApiJSON, writeApiJSON, success, testCaptcha, error }
