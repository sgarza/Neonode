var HomeController = Class('HomeController')({
  prototype : {
    init : function (){
      this._initRouter();
      return this;
    },

    _initRouter : function() {
      application.router.route('/')
        .get(this.index);

      application.router.route('/no-layout')
        .get(this.noLayout);
    },

    index : function(req, res) {
      res.render('home/index.html', {layout : 'application', posts : ["1", "2", "3", "4", "5"]});
    },

    noLayout : function(req, res) {
      res.render('home/index.html', {layout : false, posts : ["1", "2", "3", "4", "5"]});
    },
  }
});

module.exports = new HomeController();
