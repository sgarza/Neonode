/**
Global config for the app
@name global.CONFIG
@attribute_type CONSTANT
@type Object
*/
global.CONFIG = require('../config/config');

global.fs = require('fs');

// *************************************************************************
//                        Cobalt Logger
// *************************************************************************
if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log', 0744);
}

global.logger   = require('../lib/logger');

require('./db');

require('neon');
require('neon/stdlib');
require('thulium'); // Ultra fast templating engine. See https://github.com/escusado/thulium
// require('argonjs'); // Async ActiveRecord for ECMAScript https://github.com/azendal/argon

// *************************************************************************
//                        Error monitoring for neon
// *************************************************************************
if (CONFIG.enableLithium) {
  require('./../vendor/lithium');
  require('./../vendor/LithiumEngine');
}

require('fluorine');

global.express      = require('express');
global.http         = require('http');
global.glob         = require('glob');
global.inflection   = require('inflection');
global.busboy       = require('connect-busboy');
global.bodyParser   = require('body-parser');
global.cookieParser = require('cookie-parser');
global.session      = require('express-session');
global.csrf         = require('csurf');
global.morgan       = require('morgan');
global.bcrypt       = require('bcrypt');
global.flash        = require('req-flash');

if (CONFIG.enableHashids) {
  var Hashids           = require('hashids');
  global.hashids        = new Hashids(CONFIG.sessionSecret, 12);
}

if (CONFIG.enablePassport) {
  global.passport     = require('passport');
  require('./passport/LocalStrategy');
}
