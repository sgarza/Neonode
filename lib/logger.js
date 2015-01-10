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
       formatter : Cobalt.Formatter.Token,
       formatterOpts : {
           formatString : "[{{_timestamp}}] {{message}} (@{{_from}})"
       },
       file : './log/all.log'
     })
  ]
});


var handleError = function(err) {
  logger.error("Error:", err);
}


process.on('uncaughtException', function(err) {
   handleError(err);
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding){
    logger.log(message);
  }
};
