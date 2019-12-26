const logger = require('./utils/logger')
const config = require('./configure')
const { client } = require('./redis') 
client.init()
let app = require('./http-server')
port = config['APIF']['port']

app.listen(parseInt(port), () => {
    logger.info(`[APIF] listening on port : ${port}`)
    console.log('Example app listening on port ' + port);
})

