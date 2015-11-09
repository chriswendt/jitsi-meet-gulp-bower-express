var config = {};
config.log = {};
config.log.DailyRotateFile      = {};
config.log.DailyRotateFile.enabled    = true;
config.log.DailyRotateFile.level      = 'info';
config.log.DailyRotateFile.filename   = 'meet.log';
config.log.DailyRotateFile.handleExceptions = true;
config.log.DailyRotateFile.dirname    = process.env.LOG_DIR  || './log';
config.log.DailyRotateFile.maxsize    = 5242880;  //5MB
config.log.DailyRotateFile.maxFiles   = 5;
config.log.DailyRotateFile.json       = true;
config.log.DailyRotateFile.colorize   = false;
config.log.Console              = {};
config.log.Console.enabled      = true;
config.log.Console.level        = 'debug';
config.log.Console.handleExceptions = true;
config.log.Console.json         = false;
config.log.Console.colorize     = true;

module.exports = config;