var HomeController = Class('HomeController')({
  prototype : {
    init : function (){
      this._initRouter();
      return this;
    },

    _initRouter : function() {
      router.route('/')
        .get(this.index);
    },

    index : function(req, res) {
      res.render('home/index.ejs');
    }
  }
});

module.exports = new HomeController();
