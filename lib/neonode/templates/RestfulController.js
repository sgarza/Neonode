var <%= name %>Controller = Class('<%= name %>Controller').inherits(RestfulController)({
  prototype : {
    index : function index(req, res) {
      res.render('<%= name.toLowerCase() %>/index.html', {layout : false});
    },

    show : function show(req, res) {
      res.render('<%= name.toLowerCase() %>/show.html', {layout : false});
    },

    new : function(req, res) {
      res.render('<%= name.toLowerCase() %>/new.html');
    },

    create : function create(req, res) {
      res.redirect('/<%= singular.toLowerCase() %>/id');
    },

    edit : function edit(req, res) {
      res.render('<%= name.toLowerCase() %>/edit.html', {layout : false});
    },

    update : function update(req, res) {
      res.redirect('/<%= singular.toLowerCase() %>/id');
    },

    destroy : function destroy(req, res) {
      res.redirect('/<%= name.toLowerCase() %>');
    }
  }
});

module.exports = new <%= name %>Controller();
