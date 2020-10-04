// eslint-disable-next-line no-unused-vars
const winston = require('winston');
// eslint-disable-next-line no-unused-vars
const expressWinston = require('express-winston');

const configConstants = require('../config/constants');

// eslint-disable-next-line no-unused-vars
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: configConstants.requestLogFile })
  ],
  format: winston.format.json()
});
// eslint-disable-next-line no-unused-vars
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: configConstants.errorLogFile })
  ],
  format: winston.format.json()
});

module.exports = {
  requestLogger,
  errorLogger
};
