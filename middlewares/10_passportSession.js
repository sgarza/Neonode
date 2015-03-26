if (CONFIG.enablePassport) {
  module.exports = global.passport.session();
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
