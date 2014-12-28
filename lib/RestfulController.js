global.RestfulController = Class('RestfulController')({
  prototype : {
    config : null,
    resource_singular : null,
    resource_plural : null,

  	init : function (config){
      this.config = config;

    	this._initRouter();

      return this;
    },

    _initRouter : function() {
    	router.route('/' + this.resource_singular + '/:id')
    	  .get(this.show)
        .post(this.create)
        .put(this.update)
        .delete(this.destroy);

      router.route('/' + this.resource_plural + '/new')
        .get(this.new);

      router.route('/' + this.resource_plural)
        .get(this.index);
    },

    index : function(req, res) {
      res.send(200, "index")
    },

    show : function(req, res) {
      res.send(200, "show")
    },

    new : function(req, res) {
      res.send(200, "new")
    },

    create : function(req, res) {
      res.send(200, "create")
    },

    update : function(req, res) {
      res.send(200, "update")
    },

    destroy : function(req, res) {
      res.send(200, "destroy")
    },
  }
});
