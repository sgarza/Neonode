// Use this middleware to set res.locals variables

module.exports = function(req, res, next) {
  if (CONFIG.sessions !== false) {
    res.locals.csrfToken = req.csrfToken();
  }

  next();
}
