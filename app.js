redis_conn_count = 1

let app = require('./http-server')
let { client } = require('./redis')(redis_conn_count)

port = 3000

client.init((err) => {
    if (err) throw err;

    app.listen(port, () => {
        console.log('Example app listening on port ' + port);
    })

});
