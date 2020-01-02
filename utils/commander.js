let program = require('commander')
program.version('0.0.1')
program
    .option('-f, --config-file [path]', 'input your config file')
    .option('-s, --config-section [section]' , 'input your config section')
    .parse(process.argv)

    
if(!program.configFile || !program.configSection) {
    program = null
}

module.exports = program