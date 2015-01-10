var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'debug',
      filename: './log/all-logs.log',
      handleExceptions: true,
      json: false,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: true
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: false,
      json: false,
      colorize: true
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
