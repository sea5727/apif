const redis = require('redis')
const config = require('./configure')

class ApifRedis {
    constructor(){
        this._states = {
            _INIT: '_INIT',
            _CONNECTING : '_CONNECTING',
            _CONNECTED : '_CONNECTED',
            _DISCONNECTED : '_DISCONNECTED',
        }
        this._state = this._states.INIT
    }
    isConnected(){
        if(this.client == null || !'connected' in this.client )
            return false
        return this.client.connected
    }
    connect(){
        this._state = this._states._CONNECTING
        this.client = redis.createClient()

        this.client.on('connect', () => {
            this._state = this._states._CONNECTED
            let logformat = `redis connect !! `
            logformat += `ip/port : ${this.client.address} `
            logformat += `id : ${this.client.connection_id} `
            logformat += `connected : ${this.client.connected} `
            logformat += `ready : ${this.client.ready} `
            logformat += `sock : ${this.client.stream._handle.fd}`
            console.log(logformat)
            
        })
        this.client.on('error', (err) => {
            
            if (err) {
                let logformat = `redis error !! `
                logformat += `ip/port : ${this.client.address} `
                logformat += `id : ${this.client.connection_id} `
                logformat += `connected : ${this.client.connected} `
                logformat += `ready : ${this.client.ready} `
                logformat += `error' : ${err.message}`
                console.log(logformat)
            }
        })
        this.client.on('ready', () => {
            let logformat = `redis ready !! `
            logformat += `ip/port : ${this.client.address} `
            logformat += `id : ${this.client.connection_id} `
            logformat += `connected : ${this.client.connected} `
            logformat += `ready : ${this.client.ready} `
            logformat += `sock : ${this.client.stream._handle.fd}`
            console.log(logformat)
        })
        this.client.on('warning', () => {
            let logformat = `redis warning !! `
            logformat += `ip/port : ${this.client.address} `
            logformat += `id : ${this.client.connection_id} `
            logformat += `connected : ${this.client.connected} `
            logformat += `ready : ${this.client.ready} `
            logformat += `sock : ${this.client.stream._handle.fd}`
            console.log(logformat)
        })
        this.client.on('close', () => {
            console.log('client on close test')
        })
        this.client.on('end', () => {
            this._state = this._states._DISCONNECTED
            let logformat = `redis end !! `
            logformat += `ip/port : ${this.client.address} `
            logformat += `id : ${this.client.connection_id} `
            logformat += `connected : ${this.client.connected} `
            logformat += `ready : ${this.client.ready} `
            console.log(logformat)
        })

        return this
    }
    disconnect(){
        this._state = this._states.DISCONNECTED
    }
    reconnect(){
    }
    
}

let pgw2RedisManager

class RedisManager { 

    constructor(redis_connection_counter = 3){
        if(pgw2RedisManager) return pgw2RedisManager
        this._states = {
            _INIT: '_INIT',
            _START : '_START',
            _END : '_END',
        }

        this._state = this._states._INIT
        this.nRedisConnectionCounter = redis_connection_counter
        this.arrRedisSessions = new Array(this.nRedisConnectionCounter)
        for(let i = 0 ; i < this.nRedisConnectionCounter; i++){
            this.arrRedisSessions[i] = new ApifRedis()
        }
        pgw2RedisManager = this
    }
    getConnection(idx = 0){
        return this.arrRedisSessions[idx]
    }
    start(){
        let flag = false
        for(let idx in this.arrRedisSessions){
            let value = this.arrRedisSessions[idx].connect()
            if(value.isConnected() == true)
                flag |= value.isConnected()
            console.log(value)
        }
        if(flag == true){
            this._state = this._states._START
        }
    }
    end(){
        for(let idx in this.arrRedisSessions){
            this.arrRedisSessions[idx].disconnect()
        }
        this._state = this._states._END
    }
}



// pgw2Redis.instance = null

// pgw2Redis.getInstance = function(){
//     if(this.instance == null){
//         this.instance = new pgw2Redis()
//     }
        
//     return this.instance
// }

module.exports = { RedisManager } 

// pgw2Redis = function getRedisClient() {
//     const redisClient = {
//         db_0 : null,
//         db_1 : null,
//         db_2 : null,

//         init: function() {
//             console.log('redis init??')
//             console.log('test log ' , config['APIF']['port'])
//             db_0 = createClient()
//             db_1 = createClient()
//             db_2 = createClient()
//             // const select = redis.RedisClient.prototype.select

//             // require('async').parallel([
//             //     select.bind(redisClient.db_0, 0),
//             //     select.bind(redisClient.db_1, 1),
//             //     select.bind(redisClient.db_2, 2)
//             // ], next)

//         },
//     }

//     function createClient() {
//         // const client = redis.createClient(config.port, config.host)
//         const client = redis.createClient()

//         client.on('connect', () => {
//             logformat = `redis connect !! `
//             logformat += `ip/port : ${this.client.address} `
//             logformat += `id : ${this.client.connection_id} `
//             logformat += `connected : ${this.client.connected} `
//             logformat += `ready : ${this.client.ready} `
//             logformat += `sock : ${this.client.stream._handle.fd}`
//             console.log(logformat)
            
//         })


//         client.on('error', (err) => {
//             if (err) {
//                 logformat = `redis error !! `
//                 logformat += `ip/port : ${this.client.address} `
//                 logformat += `id : ${this.client.connection_id} `
//                 logformat += `connected : ${this.client.connected} `
//                 logformat += `ready : ${this.client.ready} `
//                 logformat += `error' : ${err.message}`
//                 console.log(logformat)
//             }
//         })

//         client.on('ready', () => {
//             logformat = `redis ready !! `
//             logformat += `ip/port : ${this.client.address} `
//             logformat += `id : ${this.client.connection_id} `
//             logformat += `connected : ${this.client.connected} `
//             logformat += `ready : ${this.client.ready} `
//             logformat += `sock : ${this.client.stream._handle.fd}`
//             console.log(logformat)
//         })

//         client.on('warning', (a0, a1, a2, a3, a4) => {
//             logformat = `redis warning !! `
//             logformat += `ip/port : ${this.client.address} `
//             logformat += `id : ${this.client.connection_id} `
//             logformat += `connected : ${this.client.connected} `
//             logformat += `ready : ${this.client.ready} `
//             logformat += `sock : ${this.client.stream._handle.fd}`
//             console.log(logformat)
//         })

//         client.on('close', (a0, a1, a2, a3, a4) => {
//             console.log('client on close test' , a0, a1, a2, a3, a4)
//         })


//         client.on('end', (a0, a1, a2, a3, a4) => {
//             logformat = `redis end !! `
//             logformat += `ip/port : ${this.client.address} `
//             logformat += `id : ${this.client.connection_id} `
//             logformat += `connected : ${this.client.connected} `
//             logformat += `ready : ${this.client.ready} `
//             console.log(logformat)
//         })

//         return client
//     }

//     return { redis : redis, redisClient : redisClient }
// }

// pgw2Redis.instance = null

// pgw2Redis.getInstance = function(){
//     if(this.instance == null){
//         this.instance = new pgw2Redis()
//     }
        
//     return this.instance
// }

// module.exports = pgw2Redis.getInstance()