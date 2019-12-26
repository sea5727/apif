const logger = require('./utils/logger');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const { body, oneOf, validationResult } = require('express-validator');
const { redis, client } = require('./redis')


app.use(bodyParser.json());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', [
    body('programming_language').exists(),
    body('design_tools').isIn(['canva', 'photoshop'])
], (req, res) => {
    try{
        validationResult(req).throw()
        console.log(req)
        res.status(202).send()    
    }
    catch(err){
        res.status(422).send()
    }
    
    
})
app.post('/ptt/com/1.0/bunch/create', [
    body('webApi').exists().withMessage('invalid message'),
    body('webApi.bunchId').exists().withMessage('invalid message')
], (req, res) => {
    try{
        validationResult(req).throw()
        console.log(req)
        res.status(202).send()
    }
    catch(err){
        res.status(422).send()
    }
    
});




module.exports = app