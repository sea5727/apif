const fs = require('fs')
const ini = require('ini')
let program = require('./commander')

let config = ini.parse(fs.readFileSync(program.configFile, 'utf-8'))
let usedConfig = config[`${program.configSection}`]

module.exports = usedConfig