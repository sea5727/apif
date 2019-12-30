const fs = require("fs");
const winston = require("winston");
const winston_daily_rotate_file = require("winston-daily-rotate-file")
const logDir = "log";

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
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
            filename: `${logDir}/-results.log`,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            )
        }),
    ]
});