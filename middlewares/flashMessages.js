if (CONFIG.session !== false) {
  module.exports =  require('req-flash')({ locals: 'flash' });
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
