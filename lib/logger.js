require('cobalt-log');

Cobalt.Formatter.Token.prototype.colorize = function (level, message) {
  switch(level) {
    case 0:
    case 1:
    case 2:
    case 3:
      return message.red;
    case 4:
      return message.yellow;
    case 5:
    case 6:
      return message;
    default:
      return message;
  }
}

var logger = new Cobalt.Console({
  from : CONFIG.appName,
  loggers : [
    new Cobalt.Logger.JsConsole({
      formatter : Cobalt.Formatter.Token,
      formatterOpts : {
        formatString : "{{_from}}: ".green + " {{message}}",
        ansiColor : true
      }
    }),
    new Cobalt.Logger.File({
      file : CONFIG.logFile
    })
  ]
});

module.exports = logger;

module.exports.stream = {
  write: function(message, encoding){
    logger.log(message);
  }
};
