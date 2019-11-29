module.exports = {
  test: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      database: 'barriga',
      user: 'root',
      password: 'admin'
    },
    migrations: {
      diretory: 'src/migrations'
    }
  }
}