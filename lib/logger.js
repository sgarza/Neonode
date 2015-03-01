require('cobalt-log');

var logger = new Cobalt.Console({
  from : config.appName,
  loggers : [
    new Cobalt.Logger.JsConsole({
      formatter : Cobalt.Formatter.Token,
      formatterOpts : {
        formatString : "{{_from}}: {{message}}",
        ansiColor : true
      }
    }),
    new Cobalt.Logger.File({
      file : config.logFile
    })
  ]
});

module.exports = logger;

module.exports.stream = {
  write: function(message, encoding){
    logger.log(message);
  }
};
