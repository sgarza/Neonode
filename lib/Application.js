Class('Application')({
  prototype : {
    express           : express,
    http              : http,
    server            : null,
    io                : null,
    router            : null,
    env               : CONFIG.environment,
    db                : db,
    renderOptions     : {},

    init : function (){
      logger.log("Initializing Application");

      this._configureApp()
        ._serverStart();

      logger.log("Application Initialized");

      return this;
    },

    _configureApp : function(){
      var application = this;

      this.app = this.express();

      this.server = this.http.createServer(this.app);

      // *************************************************************************
      //                  Setup Thulium engine for Express
      // *************************************************************************
      logger.log("Setting Thulium Engine for Express");
      this.app.engine('html', this._thuliumEngine.bind(this));
      this.app.set('view engine', 'html');
      this.app.set('views', 'views');

      this.app.enable("trust proxy");

      // *************************************************************************
      //                              NEON
      // *************************************************************************
      this.app.use('/neon', this.express.static('node_modules/neon'));

      // *************************************************************************
      //                             CORS
      // *************************************************************************
      this.app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
      });

      // *************************************************************************
      //                            Static routes
      // *************************************************************************
      this.app.use('/', this.express.static('public'));

      // *************************************************************************
      //                            Request Logging
      // *************************************************************************
      this.app.use(morgan('combined', {stream: logger.stream}));

      // *************************************************************************
      //                            MiddleWares
      // *************************************************************************
      logger.log("Setting up middlewares...");

      // *************************************************************************
      //                            Cookie Parser
      // *************************************************************************
      logger.log("Setting cookieParser");
      this.app.use(cookieParser(CONFIG.sessionSecret));

      // *************************************************************************
      //                           Body Parser
      // *************************************************************************
      logger.log("Setting bodyParser");
      this.app.use(bodyParser.urlencoded({extended: true}));
      this.app.use(bodyParser.json());

      // *************************************************************************
      //                          Redis
      // *************************************************************************
      if (CONFIG.enableRedis) {
        logger.log("Setting session Middlewares and Redis");

        var redis = require('redis');

        this.redisClient = redis.createClient();

        var RedisStore = require('connect-redis')(session);

        this.redisStore = new RedisStore();

        this.sessionMiddleWare = session({
          resave : false,
          saveUninitialized : true,
          key : CONFIG.sessionKey,
          store: application.redisStore,
          secret: CONFIG.sessionSecret
        });

        this.app.use(this.sessionMiddleWare);

        // *************************************************************************
        //                          CSRF
        // *************************************************************************
        logger.log("Setting csrf");
        this.app.use(csrf());
      }

      // error handler middleware for CSRF
      logger.log("Setting error handler for CSRF");

      this.app.use(function (err, req, res, next) {
        logger.error('CSRF', err, res.locals._csrf)
        if (err.code !== 'EBADCSRFTOKEN') return next(err)

        // handle CSRF token errors here
        res.status(403).send(err);
        res.send('session has expired or form tampered with');
      });

      // *************************************************************************
      //                            Passport
      // *************************************************************************
      if (CONFIG.enablePassport) {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
      }

      this.app.use(global.flash({ locals: 'flash' }));

      // *************************************************************************
      //                        Error middlewares
      // *************************************************************************
      this.app.use(function(err, req, res, next) {
        if(err.status !== 404) {
          return next();
        }

        res.status(404).send(err.message || '** no unicorns here **');
      });

      this.app.use(function(err, req, res, next) {
        logger.error('Request ERROR: ', err);
        logger.error(err.stack)
        res.status(500)
        res.send('Unhandled req error');
        next(err)
      });

      return this;
    },

    _serverStart : function(){
      this.server.listen(CONFIG.port);
    },

    _thuliumEngine : function(path, options, callback) {
      var application = this;

      var fileCache = {};

      var key = path + ':thulium:string';

      if ('function' == typeof options) {
        callback = options, options = {};
      }

      for (prop in application.renderOptions) {
        options[prop] = application.renderOptions[prop];
      }

      options.filename = path;

      var view;

      try {
        view = options.cache
          ? fileCache[key] || (fileCache[key] = fs.readFileSync(path, 'utf8'))
          : fs.readFileSync(path, 'utf8');
      } catch (err) {
        fs.readFileSync(err);
        return;
      }

      if (typeof options.layout === 'undefined') {
        options.layout = 'application';
      }

      var tm;

      options.renderPartial = function(partialPath, locals) {
        try {

          var partialFile = fs.readFileSync('./' + options.settings.views + '/' + partialPath, 'utf8');

          var partialTemplate = new Thulium({
            template : partialFile
          });

          locals = locals || {};

          for (prop in application.renderOptions) {
            locals[prop] = application.renderOptions[prop];
          }

          partialTemplate.parseSync().renderSync(locals);

          return partialTemplate.view;

        } catch (err) {
          logger.error(err);
        }

      }

      if (options.layout !== false) {
        var layoutView;

        var layoutPath = './' + options.settings.views + '/layouts/' + options.layout + '.html';

        var layoutKey = layoutPath + ':thulium:string';

        try {
          layoutView = options.cache
            ? fileCache[layoutKey] || (fileCache[layoutKey] = fs.readFileSync(layoutPath, 'utf8'))
            : fs.readFileSync(layoutPath, 'utf8');
        } catch (err) {
          logger.error(err);
          return;
        }

        tm = new Thulium({
          template : layoutView
        });

        var partial = new Thulium({
          template : view
        });

        partial.parseSync().renderSync(options);

        options.yield =  partial.view;

      } else {
        tm = new Thulium({
          template : view
        });
      }

      tm.parseSync().renderSync(options);

      var rendered = tm.view;

      callback(null, rendered);
    },

    loadControllers : function(){
      var application = this;

      this.router = this.express.Router();

      logger.log('Loading Models');

      require('./../lib/models/Model');

      glob.sync("models/*.js").forEach(function(file) {
        logger.log('Loading ' + file + '...')
        var model = require('../' + file);
      });

      logger.log('Loading RestfulController.js');
      require('./../lib/controllers/RestfulController.js');

      logger.log('Loading ApplicationController.js');
      require('./../lib/controllers/ApplicationController.js');

      var route;

      glob.sync("controllers/*.js").forEach(function(file) {
        logger.log('Loading ' + file + '...')
        var controller = require('../' + file);
      });


      this.app.use(this.router);

      return this;
    }
  }
});

//Startup
global.application = new Application();
