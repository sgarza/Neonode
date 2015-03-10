var config = {
  appName : 'Neonode',
  environment : process.env.NODE_ENV || 'development',
  logFile : './log/all.log',
  database : {
    client      : 'pg', // pg || mysql || sqlite
    logQueries  : true,
    // ***********************
    // Postgres
    // ***********************
    development : "postgres://user:password@localhost/database",
    production  :  ""

    // ***********************
    // MySQL
    // ***********************
    // developmen : {
    //   host     : '127.0.0.1',
    //   user     : 'your_database_user',
    //   password : 'your_database_password',
    //   database : 'myapp_test'
    // }
    //
    // ***********************
    // SQLite
    // ***********************
    // development : {
    //   filename: "./mydb.sqlite"
    // }
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
