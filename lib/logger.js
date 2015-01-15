require('cobalt-log');

var logger = new Cobalt.Console({
  from : "Neonode",
  loggers : [
    new Cobalt.Logger.JsConsole({
      formatter : Cobalt.Formatter.Token,
      formatterOpts : {
        formatString : "{{_from}}: {{message}}",
        ansiColor : true
      }
    }),
    new Cobalt.Logger.File({
      file : './log/all.log'
    })
  ]
});

// logger.debug = logger.log;


module.exports = logger;

module.exports.stream = {
  write: function(message, encoding){
    logger.log(message);
  }
};
