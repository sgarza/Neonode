var ApplicationController = Class('ApplicationController')({
  prototype : {
    init : function() {
      application.app.use(this._loadGlobals)

    },

    _loadGlobals : function(req, res, next) {

      if (CONFIG.enableRedis) {
        application.renderOptions.csrfToken = req.csrfToken();
      }

      if (CONFIG.enablePassport) {
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
        application.renderOptions.hashid = global.hashid;
      }

      next();
    }
  }
});

module.exports = new ApplicationController();
