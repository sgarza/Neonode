// error handler middleware for CSRF

if (CONFIG.enableRedis) {
  logger.log("Setting error handler for CSRF");

  module.exports = function (err, req, res, next) {
    logger.error('CSRF', err, res.locals._csrf)
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    res.status(403).send(err);
    res.send('session has expired or form tampered with');
  };
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
