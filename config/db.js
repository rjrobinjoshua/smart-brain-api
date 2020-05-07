const knex = require('knex');
const env = require('./env');

const db = knex({
    client: env.db.client,
    connection: {
      host : env.db.host,
      user : env.db.user,
      password : env.db.password,
      database : env.db.name
    }
});

module.exports = { db }