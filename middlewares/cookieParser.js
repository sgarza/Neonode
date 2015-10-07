// *************************************************************************
//                            Cookie Parser
// *************************************************************************
logger.log("Setting cookieParser");
if (CONFIG.sessions === false) {
  return module.exports = function(req, res, next) {
    next();
  }
}

module.exports = require('cookie-parser')(CONFIG.sessions.secret);
