import winston from 'winston';
import path from 'path';
import fs from 'fs';
import moment from 'moment-timezone';

// Define the log file path
const logDirectory = path.join(path.resolve(), 'logs');
const logFilePath = path.join(logDirectory, 'application.log');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Custom timestamp format with Mumbai time zone
const timestampFormat = winston.format((info) => {
  info.timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  return info;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    timestampFormat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        timestampFormat(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: logFilePath,
      format: winston.format.combine(
        timestampFormat(),
        winston.format.json()
      ),
    }),
  ],
});

export default logger;
