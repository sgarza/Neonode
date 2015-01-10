var HomeController = Class('HomeController')({
  prototype : {
    init : function (){
      this._initRouter();
      return this;
    },

    _initRouter : function() {
      application.router.route('/')
        .get(this.index);
    },

    index : function(req, res) {
      res.render('home/index.html', {posts : ["1", "2", "3", "4", "5"]});
    }
  }
});

module.exports = new HomeController();
