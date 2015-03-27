// *************************************************************************
//                          CSRF
// *************************************************************************
logger.log("Setting csrf");

if (CONFIG.enableRedis) {
  module.exports = global.csrf();
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
