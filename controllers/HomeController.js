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
      res.sendFile('views/index.html', {'root': __dirname + '/..'});
    }
  }
});

module.exports = new HomeController();
