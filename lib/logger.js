var winston = require('winston');
var config = require('../config/config.json');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.DailyRotateFile({
      level: config.log.DailyRotateFile.level,
      filename: config.log.DailyRotateFile.dirname + '/' + config.log.DailyRotateFile.filename,
      handleExceptions: config.log.DailyRotateFile.handleExceptions,
      json: config.log.DailyRotateFile.json,
      maxsize: config.log.DailyRotateFile.maxsize,
      maxFiles: config.log.DailyRotateFile.maxFiles,
      colorize: config.log.DailyRotateFile.colorize
    }),
    new winston.transports.Console({
      level: config.log.Console.level,
      handleExceptions: config.log.Console.handleExceptions,
      json: config.log.Console.json,
      colorize: config.log.Console.colorize
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};