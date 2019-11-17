const logger = require('./utils/logger');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();


app.use(bodyParser.json());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World get!\n');
});

app.post('/', (req, res) => {
    res.send('Hello World post!\n');
});

app.post('/postman', (req, res) => {
    console.log(req.body)
    res.send('Hello World post!\n');
});

var listen = function (port) {
    app.listen(port, () => {
        console.log(`listn : ${port}`)
        logger.info(`Example app listening on port ${port}!`)
    });
}

module.exports = listen