const fs = require('fs')

const jsonPath = process.cwd() + '/fake-api/'
const readApiJSON = (path) => {
  const filePath = jsonPath + path
  const data = fs.readFileSync(filePath, { encoding: 'utf-8', flag: 'r' })
  return JSON.parse(data)
}
const writeApiJSON = (path, data) => {
  fs.writeFileSync(process.cwd() + '/fake-api/'+path, JSON.stringify(data), {
    encoding: 'UTF-8',
    flag: 'w',
  })
}

module.exports = { jsonPath, readApiJSON, writeApiJSON }
