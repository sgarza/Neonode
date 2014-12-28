var ResourceController = Class('ResourceController').inherits(RestfulController)({
  prototype : {
    resource_singular : 'resource',
    resource_plural   : 'resources',
    init : function (config){
      RestfulController.prototype.init.call(this, config)
      return this;
    }
  }
});

module.exports = new ResourceController();
