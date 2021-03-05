const pg = require('pg');
const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL } = require('./config');

// This set pg.defaults.ssl to true only in production
pg.defaults.ssl = process.env.NODE_ENV === "production";

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
