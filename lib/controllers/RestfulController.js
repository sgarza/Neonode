global.RestfulController = Class('RestfulController')({
  prototype : {
    name : null,

    init : function (config){
      this.name = this.constructor.className.replace('Controller', '')

      this._initRouter();

      return this;
    },

    _initRouter : function() {
      application.router.route('/' + application.inflection.pluralize(this.name).toLowerCase())
        .get(this.index);

      application.router.route('/' + application.inflection.singularize(this.name).toLowerCase())
        .post(this.create);

      application.router.route('/' + application.inflection.singularize(this.name).toLowerCase() + '/:id/edit')
        .get(this.edit);

      application.router.route('/' + application.inflection.singularize(this.name).toLowerCase() + '/:id')
        .get(this.show)
        .put(this.update)
        .delete(this.destroy);

      application.router.route('/' + application.inflection.pluralize(this.name).toLowerCase() + '/new')
        .get(this.new);
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