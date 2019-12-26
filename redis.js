const redis = require('redis')
const config = require('./configure')

pgw2Redis = function getRedisClient() {
    const redisClient = {
        db_0 : null,
        db_1 : null,
        db_2 : null,

        init: function() {
            console.log('redis init??')
            console.log('test log ' , config['APIF']['port'])
            db_0 = createClient()
            db_1 = createClient()
            db_2 = createClient()
            // const select = redis.RedisClient.prototype.select

            // require('async').parallel([
            //     select.bind(redisClient.db_0, 0),
            //     select.bind(redisClient.db_1, 1),
            //     select.bind(redisClient.db_2, 2)
            // ], next)

        },
    }

    function createClient() {
        // const client = redis.createClient(config.port, config.host)
        const client = redis.createClient()

        client.on('connect', () => {
            logformat = `redis connect !! `
            logformat += `ip/port : ${client.address} `
            logformat += `id : ${client.connection_id} `
            logformat += `connected : ${client.connected} `
            logformat += `ready : ${client.ready} `
            logformat += `sock : ${client.stream._handle.fd}`
            console.log(logformat)
            
        })


        client.on('error', (err) => {
            if (err) {
                logformat = `redis error !! `
                logformat += `ip/port : ${client.address} `
                logformat += `id : ${client.connection_id} `
                logformat += `connected : ${client.connected} `
                logformat += `ready : ${client.ready} `
                logformat += `error' : ${err.message}`
                console.log(logformat)
            }
        })

        client.on('ready', () => {
            logformat = `redis ready !! `
            logformat += `ip/port : ${client.address} `
            logformat += `id : ${client.connection_id} `
            logformat += `connected : ${client.connected} `
            logformat += `ready : ${client.ready} `
            logformat += `sock : ${client.stream._handle.fd}`
            console.log(logformat)
        })

        client.on('warning', (a0, a1, a2, a3, a4) => {
            logformat = `redis warning !! `
            logformat += `ip/port : ${client.address} `
            logformat += `id : ${client.connection_id} `
            logformat += `connected : ${client.connected} `
            logformat += `ready : ${client.ready} `
            logformat += `sock : ${client.stream._handle.fd}`
            console.log(logformat)
        })

        client.on('close', (a0, a1, a2, a3, a4) => {
            console.log('client on close test' , a0, a1, a2, a3, a4)
        })


        client.on('end', (a0, a1, a2, a3, a4) => {
            logformat = `redis end !! `
            logformat += `ip/port : ${client.address} `
            logformat += `id : ${client.connection_id} `
            logformat += `connected : ${client.connected} `
            logformat += `ready : ${client.ready} `
            console.log(logformat)
        })

        return client
    }

    return { redis : redis, client : redisClient }
}

pgw2Redis.instance = null

pgw2Redis.getInstance = function(){
    if(this.instance == null){
        this.instance = new pgw2Redis()
    }
        
    return this.instance
}

module.exports = pgw2Redis.getInstance()