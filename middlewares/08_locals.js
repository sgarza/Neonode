module.exports = function(req, res, next) {
  if (CONFIG.enableRedis) {
    res.locals.csrfToken = req.csrfToken();
  }

  if (CONFIG.enablePassport) {

    res.locals.currentUser = req.user;

    // Sessions and cookie expire;
    if (req.isAuthenticated() && req.session.cookie.expires) {
      if ((Date.now() >  req.session.cookie.expires.getTime() )) {
        req.session.destroy(); // Session is expired
      } else {
        var expires;

        expires =  new Date(Date.now() + 3600000 * 24 * 365); //Add one more year

        req.session.cookie.expires = expires;

      }
    }
  }

  if (CONFIG.enableHashids) {
    res.locals.hashids = global.hashids;
  }

  next();
}
