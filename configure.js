const fs = require('fs')
const ini = require('ini')

let config = ini.parse(fs.readFileSync('./apif.ini', 'utf-8'))

console.log(config)

module.exports = config