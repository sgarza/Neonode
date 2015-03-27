// *************************************************************************
//                          Redis
// *************************************************************************
if (CONFIG.enableRedis) {
  logger.log("Setting session Middlewares and Redis");

  var redis = require('redis');

  var redisClient = redis.createClient();

  var RedisStore = require('connect-redis')(global.expressSession);

  var redisStoreInstance = new RedisStore();

  var sessionMiddleWare = expressSession({
    resave : false,
    saveUninitialized : true,
    key : CONFIG.sessionKey,
    store: redisStoreInstance,
    secret: CONFIG.sessionSecret
  });

  module.exports = sessionMiddleWare;
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
