require('cobalt-log');

Module(Cobalt.Formatter, 'Token')({
  formatString : "{{message}}",
  replaceRule : /{{(.*?)}}/g,
  separatorLength : 60,
  isoDate : true,
  separatorType : "-",
  format : function (logObject, opts){
    var indent, indentSize,
        separatorLength, separatorType,
        output, property;
    indentSize = logObject._indentLevel || 0;

    // Extend opts
    if (opts) {
      for (property in opts) {
        if (opts.hasOwnProperty(property)) {
          this[property] = opts[property];
        }
      }
    }

    indent = Array(indentSize + 1).join(' ');

    if (logObject._separator) {
      separatorLength = logObject._separatorLength || this.separatorLength;
      separatorType = logObject._separatorType || this.separatorType;
      output = indent + Array(separatorLength - indentSize + 1).join(separatorType);
    } else {
      output = indent + this.parseFormatString(logObject, this.formatString);
    }

    if (this.ansiColor) {
      output = this.colorize(logObject._level, output);
    }

    return output;
  },

  parseFormatString : function (logObject, formatString) {
    var resultString = '';
    if (typeof formatString === 'undefined') {
      formatString = this.formatString;
    }

    resultString = formatString.replace(this.replaceRule, function(match, paren){
      var date;
      if (paren === "_timestamp" && this.isoDate) {
        date = new Date(logObject[paren]);
        return date.toISOString();
      }
      return logObject[paren] || "-";
    }.bind(this));

    return resultString;
  },

  colorize : function (level, message) {
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
});


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
