#! /usr/local/bin/node

//Config
var serverPort = process.env.PORT || 3000;

//Dependencies
var express     = require('express'),
    http        = require('http'),
    app         = express(),
    server      = http.createServer(app),
    io          = require('socket.io').listen(server),
    fs          = require('fs'),
    glob        = require('glob'),
    inflection  = require('inflection');

require('neon');

//Application
Class('Application')({
  prototype : {
    inflection : inflection,

    init : function (){
      this._configureApp()
        ._setupSockets()
        ._serverStart();

      return this;
    },

    _configureApp : function(){
      //neon
      app.use('/neon', express.static('node_modules/neon'));

      //CORS
      app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
      });

      //Static routes
      app.use('/public', express.static('public'));

      return this;
    },

    _setupSockets : function(){
      var server = this;

      io.sockets.on('connection', function (socket) {
        socket.on('client:hello', server._clientHello.bind(this, socket));
      });

      return this;
    },

    _clientHello : function(socket, data){
      data.message = 'Server echo: '+ data.message;
      socket.emit('server:echo', data);
    },

    _serverStart : function(){
      console.log('Server ready');
      console.log('http://localhost:'+serverPort.toString());
      server.listen(serverPort);
    },

    loadControllers : function(){
      global.router = express.Router();

      require('../lib/RestfulController.js');

      var route;

      glob.sync("controllers/*.js").forEach(function(file) {
        console.log('Loading ' + file + '...')
        require('../' + file);
      });


      app.use(router);

      return this;
    }
  }
});

//Startup
global.application = new Application();

application.loadControllers();
