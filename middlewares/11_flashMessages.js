if (CONFIG.enableRedis) {
  module.exports =  global.flash({ locals: 'flash' });
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
