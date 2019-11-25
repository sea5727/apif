const redis = require('redis')


module.exports = ( (count=1) => {
    const redisClient = {
        db_count : count,
        
        init: function(next) {
            this.db = [this.db_count]
            for(var i = 0; i < this.db_count ; i++){
                this.db[i] = createClient()
            }
            
            next()
            // const select = redis.RedisClient.prototype.select

            // select.bind(redisClient.db_0, 0)
            // select.bind(redisClient.db_1, 1)
            // select.bind(redisClient.db_2, 2)

            // require('async').parallel([
            //     select.bind(redisClient.db_0, 0),
            //     select.bind(redisClient.db_1, 1),
            //     select.bind(redisClient.db_2, 2)
            // ], next)

        },
        getDB: function(index){
            return db[index]
        }
    }

    function createClient() {
        // const client = redis.createClient(config.port, config.host)
        const client = redis.createClient()

        client.on('error', (err, reply) => {
            if (err) throw err
            console.log("Error " + reply)
        })

        return client
    }

    return { redis: redis, client : redisClient }
})