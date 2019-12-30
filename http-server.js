const logger = require('./utils/logger');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const { body, param, validationResult, matchedData } = require('express-validator');
// const { redis, redisClient } = require('./redis')
const { RedisManager } = require('./redis')


app.use(bodyParser.json());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/ptt/com/1.0/bunch/create', [
    body('webApi')
        .notEmpty().withMessage('mandantory data'),
    body('webApi.bunchId')
        .notEmpty().withMessage('mandantory data')
        .isLength({max:8}).withMessage('too long'),
    body('webApi.scuId')
        .notEmpty().withMessage('mandantory data')
        .isInt().withMessage('invalid data'),
    body('webApi.Id')
        .notEmpty().withMessage('mandatory data')
        .isLength({max:32}).withMessage('too long'),
    body('webApi.pwd').escape()
        .isLength({max:64}).withMessage('too long'),
    body('webApi.phoneNum').escape()
        .isLength({max:32}).withMessage('too long'),
    body('webApi.email').escape()
        .if(body('webApi.email').exists())
        .isEmail().withMessage('invalid format')
        .isLength({max:64}).withMessage('too long'),
    body('webApi.desc').escape()
        .isLength({max:128}).withMessage('too long'),
], (req, res) => {
    try{
        validationResult(req).formatWith(({location, msg, param}) => `${location}[${param}] : ${msg}`).throw()
        manager = new RedisManager()
        const client = manager.getConnection().client
        let datas = matchedData(req, { onlyValidData: true })
        const bunchId = datas.webApi.bunchId
        if('bunchId' in datas.webApi){
            delete datas.webApi['bunchId']
        }
        
        client.set("BUNCH_LIST", `${bunchId}` , (err, reply) => {
            logger.info(`Redis set : BUNCH_LIST ${bunchId}, data : ${bunchId}, err:${err}, reply:${reply}`)
        })
        let dataFormat = ``
        for (let [key, value] of Object.entries(datas.webApi)) {
            dataFormat += `${key}: ${value}, `
        }
        client.hmset(`BUNCH_INFO#${bunchId}`, datas.webApi, (err, reply) => {
            logger.info(`Redis hmset : BUNCH_INFO ${bunchId}, data : ${dataFormat}, err:${err}, reply:${reply}`)
        });

        client.lpush(`BUNCH_INFO_Q` , `${bunchId}`, (err, reply) => {
            logger.info(`Redis lpush : BUNCH_INFO_Q : ${bunchId},  err:${err}, reply:${reply}`)
        })


        res.charset = 'utf-8';
        res.contentType('text/plain').status(200).send('200 OK')
    }
    catch(err){
        let message = ''
        if('message' in err)
            message = err['message']
        else 
            message = err.array()[0]
        res.charset = 'utf-8';
        res.contentType('text/plain').status(500).send(message)
    }
    
})

app.patch('/ptt/com/1.0/bunch/:bunchId', [
    param('bunchId')
        .notEmpty().withMessage('mandantory data')
        .isLength({max:8}).withMessage('too long'),
    body('webApi')
        .notEmpty().withMessage('mandantory data'),
    body('webApi.scuId')
        .notEmpty().withMessage('mandantory data')
        .isInt().withMessage('invalid data'),
    body('webApi.Id')
        .notEmpty().withMessage('mandatory data')
        .isLength({max:32}).withMessage('too long'),
    body('webApi.phoneNum')
        .isLength({max:32}).withMessage('too long'),
    body('webApi.email')
        .if(body('webApi.email').exists())
        .isEmail().withMessage('invalid format')
        .isLength({max:64}).withMessage('too long'),
    body('webApi.desc')
        .isLength({max:128}).withMessage('too long'),
], (req, res) => {
    try{
        logger.info(`RECV API <== ${req.originalUrl}`)
        validationResult(req).formatWith(({location, msg, param}) => `${location}[${param}] : ${msg}`).throw()

        manager = new RedisManager()
        const client = manager.getConnection().client
        const bunchId = req.params.bunchId
        
        let datas = matchedData(req, { onlyValidData: true })
        if('bunchId' in datas.webApi){
            delete datas.webApi['bunchId']
        }

        client.set("BUNCH_LIST", `${bunchId}`, (err, reply) => {
            logger.info(`Redis set : BUNCH_LIST, data : ${bunchId}, err:${err}, reply:${reply}`)
        })
        let dataFormat = ``
        for (let [key, value] of Object.entries(datas.webApi)) {
            dataFormat += `${key}: ${value}, `
        }
        client.hmset(`BUNCH_INFO#${bunchId}`, datas.webApi, (err, reply) => {
            logger.info(`Redis hmset : BUNCH_INFO#${bunchId}, data : ${dataFormat}, err:${err}, reply:${reply}`)
        });

        client.lpush(`BUNCH_INFO_Q` , `${bunchId}`, (err, reply) => {
            logger.info(`Redis lpush : BUNCH_INFO_Q : ${bunchId},  err:${err}, reply:${reply}`)
        })

        res.charset = 'utf-8';
        res.contentType('text/plain').status(200).send('200 OK')
    }
    catch(err){
        let message = ''
        if('message' in err)
            message = err['message']
        else 
            message = err.array()[0]
        res.charset = 'utf-8';
        res.contentType('text/plain').status(500).send(message)
    }
})

app.delete('/ptt/com/1.0/bunch/:bunchId',[
    param('bunchId')
        .notEmpty().withMessage('mandantory data')
        .isLength({max:8}).withMessage('too long'),
], (req, res) => {
    try{
        validationResult(req).formatWith(({location, msg, param}) => `${location}[${param}] : ${msg}`).throw()

        const bunchId = req.params.bunchId

        manager = new RedisManager()
        const client = manager.getConnection().client

        client.del(`BUNCH_INFO#${bunchId}`, (err, reply) => {
            logger.info(`Redis del : BUNCH_INFO#${bunchId}, err:${err}, reply:${reply}`)
        })

        client.hmset(`BUNCH_INFO#${bunchId}`, datas.webApi, (err, reply) => {
            logger.info(`Redis hmset : BUNCH_INFO#${bunchId}, data : ${dataFormat}, err:${err}, reply:${reply}`)
        });
        
        res.charset = 'utf-8';
        res.contentType('text/plain').status(200).send('200 OK')
    }
    catch(err){
        let message = ''
        if('message' in err)
            message = err['message']
        else 
            message = err.array()[0]
        res.charset = 'utf-8';
        res.contentType('text/plain').status(500).send(message)
    }
})



module.exports = app