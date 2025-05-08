const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pgsql',
  password: 'test',
  port: 5432, // default PostgreSQL port
});

module.exports = pool;