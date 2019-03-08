import * as appRoot from 'app-root-path';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, printf, colorize } = format;
const myFormat = printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});
const transport = new DailyRotateFile({
    dirname: `${appRoot}/logs`,
    filename: 'log-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '14d'
});

const logger: any = createLogger({
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                myFormat
            ),
            handleExceptions: true
        }),
        transport
    ],
    exitOnError: false
});

logger.stream = {
    write(message, encoding) {
        logger.log({
            message,
            level: 'info'
        });
    }
};

export default logger;
