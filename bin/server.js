#!/usr/bin/env node

//Config
var serverPort = process.env.PORT || 3000;

//Dependencies
var express       = require('express'),
    http          = require('http'),
    app           = express(),
    server        = http.createServer(app),
    io            = require('socket.io').listen(server),
    fs            = require('fs'),
    glob          = require('glob'),
    inflection    = require('inflection'),
    busboy        = require('connect-busboy'), // A streaming parser for HTML
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    csrf          = require('csurf'),
    morgan        = require('morgan'), // http request logger middleware
    logger        = require("../lib/logger"),
    ejsMate       = require('ejs-mate');

require('neon');

//Application
Class('Application')({
  prototype : {
    inflection : inflection,

    init : function (){
      logger.info("Initializing Application");
      this._banner()
        ._configureApp()
        ._setupSockets()
        ._serverStart();

      logger.info("Application Initialized");

      return this;
    },

    _banner : function() {
      logger.info("#  ███╗   ██╗███████╗ ██████╗ ███╗   ██╗ ██████╗ ██████╗ ███████╗");
      logger.info("#  ████╗  ██║██╔════╝██╔═══██╗████╗  ██║██╔═══██╗██╔══██╗██╔════╝");
      logger.info("#  ██╔██╗ ██║█████╗  ██║   ██║██╔██╗ ██║██║   ██║██║  ██║█████╗  ");
      logger.info("#  ██║╚██╗██║██╔══╝  ██║   ██║██║╚██╗██║██║   ██║██║  ██║██╔══╝  ");
      logger.info("#  ██║ ╚████║███████╗╚██████╔╝██║ ╚████║╚██████╔╝██████╔╝███████╗");
      logger.info("#  ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝");
      logger.info("#                                                                ");
      logger.info("#  ██╗   ██╗ ██████╗     ██████╗    ██╗                          ");
      logger.info("#  ██║   ██║██╔═████╗   ██╔═████╗  ███║                          ");
      logger.info("#  ██║   ██║██║██╔██║   ██║██╔██║  ╚██║                          ");
      logger.info("#  ╚██╗ ██╔╝████╔╝██║   ████╔╝██║   ██║                          ");
      logger.info("#   ╚████╔╝ ╚██████╔╝██╗╚██████╔╝██╗██║                          ");
      logger.info("#    ╚═══╝   ╚═════╝ ╚═╝ ╚═════╝ ╚═╝╚═╝                          ");
      logger.info("#                                                                ");

      return this;
    },

    _configureApp : function(){
      // App Logging
      app.use(morgan('combined' ,{stream: logger.stream}));

      app.engine('ejs', ejsMate);

      app.set('views', 'views');
      app.set('view engine', 'ejs');

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

      // MiddleWares
      logger.debug("Setting up middlewares...");

      logger.debug("Setting busboy");
      app.use(busboy());

      logger.debug("Setting cookieParser");
      app.use(cookieParser());

      logger.debug("Setting session");
      app.use(session({
        secret: 'APP SECRET : CHANGE THIS',
        resave: false,
        saveUninitialized: true
      }));

      logger.debug("Setting csrf");
      app.use(csrf());

      // error handler middleware for CSRF
      logger.debug("Setting error handler for CSRF");
      app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)

        // handle CSRF token errors here
        res.status(403)
        res.send('session has expired or form tampered with')
      });

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
      server.listen(serverPort);
    },

    loadControllers : function(){
      global.router = express.Router();

      require('../lib/RestfulController.js');

      var route;

      glob.sync("controllers/*.js").forEach(function(file) {
        logger.info('Loading ' + file + '...')
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

logger.info('Neonode server ready');
logger.info("Listening on port: " + serverPort.toString());
