// *************************************************************************
//                          Redis
// *************************************************************************
if (CONFIG.sessions !== false) {
  logger.log("Setting session Middlewares and Redis");

  var redis = require('redis');

  var redisClient = redis.createClient();

  var session = require('express-session');

  var RedisStore = require('connect-redis')(session);

  var redisStoreInstance = new RedisStore();

  var sessionMiddleWare = session({
    resave : false,
    saveUninitialized : true,
    key : CONFIG.sessions.key,
    store: redisStoreInstance,
    secret: CONFIG.sessions.secret
  });

  module.exports = sessionMiddleWare;
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
