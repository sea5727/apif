const redis = require('redis')
const { promisify } = require('util')
let client = redis.createClient()
const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

client.on('error', (err) => {
    console.log('Error ' + err)
})

client.ping(redis.print)

myGet = async function () {
    const res = await getAsync('string key', redis.print)
    console.log(res);
}

mySet = async function(){
    const res = await setAsync('string key', `string val ${i}`, redis.print)
    console.log(res);
}


myFunc()

for(var i = 0; i < 10000 ; i++){
    client.set('string key', `string val ${i}`, redis.print)
    client.get('string key', redis.print)
    
}

// client.quit();

