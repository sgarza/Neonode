var env = process.env.NODE_ENV || 'development';

var config = {
  appName : 'Neonode',
  environment : env,
  logFile : './log/' + env + '.log',
  database : {
    logQueries  : true,

    development : {
      client: 'postgresql',
      connection: {
        database: 'databaseName',
        user:     'userName',
        password: ''
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      },
      seeds : {
        directory : './seeds/dev'
      }
    },
  },
  port            : process.env.PORT || 3000,
  enableLithium   : false,
  enableHashids   : false, // https://github.com/hashids/
  enablePassport  : false,
  sessionKey      : 'session',
  sessionSecret   : 'EDIT ME ctYArFqrrXy4snywpApkTcfootxsz9Ko',
  enableRedis     : false,
  siteUrl : {
    production: '',
    development : 'http://localhost:3000'
  }
}

module.exports = config;
