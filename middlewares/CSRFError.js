// error handler middleware for CSRF

if (CONFIG.sessions === false) {
  return module.exports = function(req, res, next) {
    next();
  }
}

logger.log("Setting error handler for CSRF");

module.exports = function (err, req, res, next) {
  logger.error('CSRF', err, res.locals._csrf);
  next(err);
};
