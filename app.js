let program = require('./utils/commander')
if(!program) {
    console.log('please input arguments [ config-file and config-section are mandatory] ')
    return   
}
const logger = require('./utils/logger')

logger.info(`[APIF] --config-file : ${program.configFile}`)
logger.info(`[APIF] --config-section : ${program.configSection}`)

const config = require('./utils/configure')
const { RedisManager } = require('./redis')
let manager = new RedisManager()
manager.start()

let app = require('./http-server')
let port = 'http_port' in config ? parseInt(config.http_port) : 3000

app.listen(port, () => {
    logger.info(`[APIF] listening on port : ${port}`)
    console.log('Example app listening on port ' + port);
})

