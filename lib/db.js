global.db = require('knex')({
  client: config.database.client,
  connection: config.database[config.environment]
});

if (config.database.logQuerys) {
  db.on('query', function(data) {
    logger.info(data.sql + ' | ' + data.bindings);
  });
}
