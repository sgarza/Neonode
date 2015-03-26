// *************************************************************************
//                            Passport
// *************************************************************************
if (CONFIG.enablePassport) {
  module.exports = global.passport.initialize();
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
