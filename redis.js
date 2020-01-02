const redis = require('redis')
const logger = require('./utils/logger')
const config = require('./utils/configure')
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
        this.option = {}
        if('redis_host' in config){
            this.option['host'] = config.redis_host
        }
        if('redis_port' in config){
            this.option['port'] = config.redis_port
        }
        this.client = redis.createClient(this.option)

        this.client.on('connect', () => {
            this._state = this._states._CONNECTED
            let logformat = `redis connect !! `
            logformat += `ip/port : ${this.client.address} `
            logformat += `id : ${this.client.connection_id} `
            logformat += `connected : ${this.client.connected} `
            logformat += `ready : ${this.client.ready} `
            logformat += `sock : ${this.client.stream._handle.fd}`
            logger.info(logformat)
            
        })
        this.client.on('reconnecting', () => {
            this._state = this._states._CONNECTING
            let logformat = `redis reconnecting !! `
            logformat += `ip/port : ${this.client.address} `
            logformat += `id : ${this.client.connection_id} `
            logformat += `connected : ${this.client.connected} `
            logformat += `ready : ${this.client.ready} `
            logger.info(logformat)
            
        })
        this.client.on('error', (err) => {
            
            if (err) {
                let logformat = `redis error !! `
                logformat += `ip/port : ${this.client.address} `
                logformat += `id : ${this.client.connection_id} `
                logformat += `connected : ${this.client.connected} `
                logformat += `ready : ${this.client.ready} `
                logformat += `error' : ${err.message}`
                logger.info(logformat)
            }
        })
        this.client.on('ready', () => {
            let logformat = `redis ready !! `
            logformat += `ip/port : ${this.client.address} `
            logformat += `id : ${this.client.connection_id} `
            logformat += `connected : ${this.client.connected} `
            logformat += `ready : ${this.client.ready} `
            logformat += `sock : ${this.client.stream._handle.fd}`
            logger.info(logformat)
        })
        this.client.on('warning', () => {
            let logformat = `redis warning !! `
            logformat += `ip/port : ${this.client.address} `
            logformat += `id : ${this.client.connection_id} `
            logformat += `connected : ${this.client.connected} `
            logformat += `ready : ${this.client.ready} `
            logformat += `sock : ${this.client.stream._handle.fd}`
            logger.info(logformat)
        })
        this.client.on('close', () => {
            logger.info('client on close test')
        })
        this.client.on('end', () => {
            this._state = this._states._DISCONNECTED
            let logformat = `redis end !! `
            logformat += `ip/port : ${this.client.address} `
            logformat += `id : ${this.client.connection_id} `
            logformat += `connected : ${this.client.connected} `
            logformat += `ready : ${this.client.ready} `
            logger.info(logformat)
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

module.exports = { RedisManager } 
