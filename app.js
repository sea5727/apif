const logger = require('./utils/logger')
const config = require('./configure')
// const { redisClient } = require('./redis') 
//redisClient.init()
const { RedisManager } = require('./redis')
let manager = new RedisManager()
manager.start()

let app = require('./http-server')
port = config['APIF']['port']

app.listen(parseInt(port), () => {
    logger.info(`[APIF] listening on port : ${port}`)
    console.log('Example app listening on port ' + port);
})

