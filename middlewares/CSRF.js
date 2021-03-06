// *************************************************************************
//                          CSRF
// *************************************************************************
logger.log("Setting csrf");

if (CONFIG.sessions !== false) {
  module.exports = require('csurf')();
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
