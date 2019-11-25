const logger = require('./utils/logger');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const { redis, client } = require('./redis')(5)


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


app.get('/postman', (req, res) => {
    console.log(req.body)
    console.log(redis)
    console.log(client)
    res.send('Hello World post!\n');
});


module.exports = app