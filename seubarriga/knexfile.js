module.exports = {
  client: 'mysql',
  connection: {
    database: 'barriga',
    user: 'root',
    password: 'admin'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}