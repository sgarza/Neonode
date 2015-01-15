#!/usr/bin/env node

//Config
var serverPort = process.env.PORT || 3000;

//Dependencies

var fs = require('fs');
require('neon');

require('thulium'); // Ultra fast templating engine. See https://github.com/escusado/thulium
require('argonjs'); // Async ActiveRecord for ECMAScript https://github.com/azendal/argon

if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log', 0744);
}

global.logger   = require('../lib/logger');
require('./../vendor/lithium'); // Error monitoring for neon
require('./../vendor/LithiumEngine');
global.async    = require('async');

var bodyParser = require('body-parser');

//Application
Class('Application')({
  prototype : {
    express           : require('express'),
    http              : require('http'),
    app               : null,
    server            : null,
    io                : null,
    fs                : fs,
    glob              : require('glob'),
    inflection        : require('inflection'),
    busboy            : require('connect-busboy'),
    bodyParser        : bodyParser,
    cookieParser      : require('cookie-parser'),
    session           : require('express-session'),
    csrf              : require('csurf'),
    morgan            : require('morgan'),
    router            : null,
    controllers       : [],
    models            : [],
    env               : process.env.NODE_ENV || 'development',

    init : function (){
      logger.info("Initializing Application");

      this._configureApp()
        ._setupSockets()
        ._serverStart();

      logger.info("Application Initialized");

      return this;
    },

    _configureApp : function(){
      var application = this;

      this.app = this.express();
      this.server = this.http.createServer(this.app);

      // Setup Thulium engine for ExpressJS
      logger.debug("Setting Thulium Engine for Express");
      this.app.engine('html', this._thuliumEngine.bind(this));

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
      this.app.use('/', this.express.static('public'));

      // App Logging
      this.app.use(this.morgan('combined' ,{stream: logger.stream}));

      // MiddleWares
      logger.debug("Setting up middlewares...");

      logger.debug("Setting busboy");
      this.app.use(this.busboy());

      logger.debug("Setting bodyParser");
      this.app.use(bodyParser.json());

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

    _thuliumEngine : function(path, options, callback) {
      var application = this;

      var fileCache = {};

      var key = path + ':thulium:string';

      if ('function' == typeof options) {
        callback = options, options = {};
      }

      options.filename = path;

      var view;

      try {
        view = options.cache
          ? fileCache[key] || (fileCache[key] = application.fs.readFileSync(path, 'utf8'))
          : application.fs.readFileSync(path, 'utf8');
      } catch (err) {
        application.fs.readFileSync(err);
        return;
      }

      if (typeof options.layout === 'undefined') {
        options.layout = 'application';
      }

      var tm;

      if (options.layout !== false) {
        var layoutView;

        var layoutPath = './' + options.settings.views + '/layouts/' + options.layout + '.html';

        var layoutKey = layoutPath + ':thulium:string';

        try {
          layoutView = options.cache
            ? fileCache[layoutKey] || (fileCache[layoutKey] = application.fs.readFileSync(layoutPath, 'utf8'))
            : application.fs.readFileSync(layoutPath, 'utf8');
        } catch (err) {
          application.fs.readFileSync(err);
          return;
        }

        tm = new Thulium({
          template : layoutView
        });

        var partial = new Thulium({
          template : view
        });

        options.yield = partial.parseSync().renderSync(options);

      } else {
        tm = new Thulium({
          template : view
        });
      }

      var rendered = tm.parseSync().renderSync(options);

      callback(null, rendered);
    },

    loadControllers : function(){
      var application = this;

      this.router = this.express.Router();

      require('../lib/RestfulController.js');

      var route;

      this.glob.sync("controllers/*.js").forEach(function(file) {
        logger.info('Loading ' + file + '...')
        var controller = require('../' + file);
        application.controllers.push(controller);
      });

      this.app.use(this.router);

      return this;
    }
  }
});

//Startup
global.application = new Application();

application.loadControllers();

logger.info('Neonode server ready');
logger.info("Listening on port: " + serverPort.toString());
