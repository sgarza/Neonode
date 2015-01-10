#!/usr/bin/env node

//Config
var serverPort = process.env.PORT || 3000;

//Dependencies
require('neon');
require('Thulium'); // Ultra fast templating engine. See https://github.com/escusado/thulium
require('argonjs'); // Async ActiveRecord for ECMAScript https://github.com/azendal/argon

global.logger = require('../lib/logger');

//Application
Class('Application')({
  prototype : {
    express       : require('express'),
    http          : require('http'),
    app           : null,
    server        : null,
    io            : null,
    fs            : require('fs'),
    glob          : require('glob'),
    inflection    : require('inflection'),
    busboy        : require('connect-busboy'),
    cookieParser  : require('cookie-parser'),
    session       : require('express-session'),
    csrf          : require('csurf'),
    morgan        : require('morgan'),

    init : function (){
      logger.log("Initializing Application");

      this._configureApp()
        ._setupSockets()
        ._serverStart();

      logger.log("Application Initialized");

      return this;
    },

    _configureApp : function(){
      var application = this;

      this.app = this.express();
      this.server = this.http.createServer(this.app);

      // App Logging
      this.app.use(this.morgan('combined' ,{stream: logger.stream}));

      // Setup Thulium engine for ExpressJS
      this.app.engine('html', function(path, options, callback){
        var fileCache = {};

        var key = path + ':thulium:string';

        if ('function' == typeof options) {
          callback = options, options = {};
        }

        options.filename = path;

        var str;

        try {
          str = options.cache
            ? fileCache[key] || (fileCache[key] = this.fs.readFileSync(path, 'utf8'))
            : this.fs.readFileSync(path, 'utf8');
        } catch (err) {
          this.fs.readFileSync(err);
          return;
        }

        var tm = new Thulium({
          template : str
        });

        var rendered = tm.parseSync().renderSync(options);

        callback(null, rendered);
      });

      this.app.set('views', 'views');

      //neon
      this.app.use('/neon', this.express.static('node_modules/neon'));

      //CORS
      this.app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
      });

      //Static routes
      this.app.use('/public', this.express.static('public'));

      // MiddleWares
      logger.debug("Setting up middlewares...");

      logger.debug("Setting busboy");
      this.app.use(this.busboy());

      logger.debug("Setting cookieParser");
      this.app.use(this.cookieParser());

      logger.debug("Setting session");
      this.app.use(this.session({
        secret: 'APP SECRET : CHANGE THIS',
        resave: false,
        saveUninitialized: true
      }));

      logger.debug("Setting csrf");
      this.app.use(this.csrf());

      // error handler middleware for CSRF
      logger.debug("Setting error handler for CSRF");
      this.app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)

        // handle CSRF token errors here
        res.status(403)
        res.send('session has expired or form tampered with')
      });

      return this;
    },

    _setupSockets : function(){
      var application = this;

      this.io = require('socket.io').listen(this.server);

      this.io.sockets.on('connection', function (socket) {
        socket.on('client:hello', application._clientHello.bind(this, socket));
      });

      return this;
    },

    _clientHello : function(socket, data){
      data.message = 'Server echo: '+ data.message;
      socket.emit('server:echo', data);
    },

    _serverStart : function(){
      this.server.listen(serverPort);
    },

    loadControllers : function(){
      var application = this;

      global.router = this.express.Router();

      require('../lib/RestfulController.js');

      var route;

      this.glob.sync("controllers/*.js").forEach(function(file) {
        logger.log('Loading ' + file + '...')
        require('../' + file);
      });


      this.app.use(router);

      return this;
    }
  }
});

//Startup
global.application = new Application();

application.loadControllers();

logger.log('Neonode server ready');
logger.log("Listening on port: " + serverPort.toString());
