var _      = require('lodash');
require('lodash-inflection');

var routeMapper = require('./../config/routeMapper.js');

var router = global.application.express.Router();

logger.info('Loading routes...');
routeMapper.routes.forEach(function(route) {
  var controller = route.controller();
  var action     = route.action();
  var verbs      = route.verb();

  verbs.forEach(function(verb) {
    logger.info(verb + ' ' + route.path + ' ' + controller + '#' + action);
    router.route(route.path)[verb](application.controllers[controller][action]);
  });
});

module.exports = router;
