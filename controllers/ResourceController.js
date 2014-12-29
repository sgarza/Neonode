var ResourceController = Class('ResourceController').inherits(RestfulController)({
  prototype : {
    init : function (config){
      RestfulController.prototype.init.call(this, config)
      return this;
    }
  }
});

module.exports = new ResourceController();
