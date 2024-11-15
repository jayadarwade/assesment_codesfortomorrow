import expressWinston from 'express-winston';
import winston from 'winston';
import path from 'path';
import fs from 'fs';
// Define log directory at the root of the project
const logDirectory = path.join(process.cwd(), 'request-response');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Function to generate the log filename with the current date
const getLogFilename = () => {
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);  // Get YYYY-MM-DD format
  return path.join(logDirectory, `${formattedDate}.log`);
};

const logFormat = winston.format.printf(({ timestamp, level, message, meta }) => {
  return `${timestamp} ${level.toUpperCase()}: ${message} ${meta ? JSON.stringify(meta) : ''}`;
});

// Middleware to log request and response
export const loggerMiddleware = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: getLogFilename() }),  // Dynamically generate filename
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Add timestamp
    winston.format.json(),
    logFormat  // Custom format to include timestamp in log output
  ),
  msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}",
  meta: true,
  expressFormat: true,
  colorize: false,
  responseField: 'res',
  ignoreRoute: (req, res) => false,  // Do not ignore any routes
  requestWhitelist: ['body'],  // Log request body
  responseWhitelist: ['body'],  // Log response body
  dynamicMeta: (req, res) => {
    return {};
  }
});
