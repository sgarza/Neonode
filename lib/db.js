global.db = require('knex')({
  client: CONFIG.database.client,
  connection: CONFIG.database[CONFIG.environment]
});

if (CONFIG.database.logQueries) {
  db.on('query', function(data) {
    logger.log('SQL: '.yellow + data.sql + ' Data: '.yellow + data.bindings);
  });
}
