module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'barriga',
      user: 'postgres',
      password: 'admin'
    },
    migrations: {
      diretory: 'src/migrations'
    }
  }
}