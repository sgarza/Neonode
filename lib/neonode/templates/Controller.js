var <%= name %>Controller = Class('<%= name %>Controller')({
  prototype : {
    init : function (){
      this._initRouter();
      return this;
    },

    _initRouter : function() {
      application.router.route('/<%= name.toLowerCase() %>')
        .get(this.index);
    },

    index : function(req, res) {
      res.render('<%= name.toLowerCase() %>/index.html', {layout : false, localVariable: true });
    },
  }
});

module.exports = new <%=name%>Controller();
