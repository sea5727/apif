const config = require('./configure')
const fs = require("fs");
const winston = require("winston");
const winston_daily_rotate_file = require("winston-daily-rotate-file")

let logLevel = `debug`
let logPath = './apif.log'
if('log_path' in config){
    logPath = config.log_path
}
if('log_level' in config){
    logLevel = config.log_level.toLowerCase()
}

//const tsFormat = () => (new Date()).toLocaleTimeString();
function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
};

const jsonFormatter = (logEntry) => {
    if (logEntry.type) {
        const base = {
            timestamp: new Date()
        };
        const json = Object.assign(base, logEntry);
        logEntry[MESSAGE] = JSON.stringify(json);
    } else {
        logEntry = "";
    }

    return logEntry;
}

module.exports = logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.align(),
                winston.format.json(),
            ),
            level: 'debug'
        }),
        new (winston_daily_rotate_file)({
            filename: `${logPath}`,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            )
        }),
    ]
});