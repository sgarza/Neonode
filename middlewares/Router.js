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
      })[0];

      filters.forEach(function(filter) {
        if (_.isString(filter)) {
          args.push(application.controllers[controller][filter]);
        } else if (_.isFunction(filter)) {
          args.push(filter);
        } else {
          throw new Error('Invalid before filter in controller ' + controller);
        }
      });
    }

    args.push(controllerMethod);

    router.route(route.path)[verb](args);
  });
});

module.exports = router;
