var env = process.env.NODE_ENV || 'development';

var config = {
  appName : 'Neonode',
  environment : env,
  logFile : './log/' + env + '.log',
  port            : process.env.PORT || 3000,

  // sessions : false, if you want to disable Redis sessions
  sessions       : {
    key      : 'session',
    secret   : 'EDIT ME ctYArFqrrXy4snywpApkTcfootxsz9Ko',
  },
  siteUrl : {
    development : 'http://localhost:3000',
    staging : '',
    production: ''
  }
}

// Run knex init to create the knexfile.js
config.database        = require('./../knexfile.js');

config.middlewares     = require('./middlewares.js');

config.enableLithium   = false;

module.exports = config;
