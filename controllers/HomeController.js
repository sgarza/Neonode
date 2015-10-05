var HomeController = Class('HomeController').inherits(BaseController)({
  prototype : {
    index : function(req, res) {
      res.render('home/index.html', {layout : 'application', posts : ["1", "2", "3", "4", "5"]});
    },

    noLayout : function(req, res) {
      res.render('home/index.html', {layout : false, posts : ["1", "2", "3", "4", "5"]});
    },
  }
});

module.exports = new HomeController();
