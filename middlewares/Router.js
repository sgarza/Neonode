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

    var controllerMethod = application.controllers[controller][action];
    var beforeActions    = application.controllers[controller].constructor.beforeActions;

    var args = [];

    if (beforeActions.length > 0) {
      var filters = beforeActions.filter(function(item) {
          if (item.actions.indexOf(action) !== -1) {
              return true;
          }
      }).map(function(item) {
          return item.before;
      });

      filters.forEach(function(filter) {
        args.push(application.controllers[controller][filter]);
      });
    }

    args.push(controllerMethod);

    router.route(route.path)[verb](args);
  });
});

module.exports = router;
