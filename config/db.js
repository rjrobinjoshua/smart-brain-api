
const knex = require('knex');
const env = require('./env');

const db = knex({
    client: env.db.client,
    connection: {
      connectionString : env.db.connectionUrl,
      ssl: env.db.ssl
    }
});

module.exports = { db }