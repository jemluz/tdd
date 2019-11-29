// modulo da aplicação utilizado pelo teste e pelo servidor
const app = require('express')()
const consign = require('consign')

const knex = require('knex')
// const knexlogger = require('knex-logger')
const knexfile = require('../knexfile')

app.db = knex(knexfile.test)
// app.use(knexlogger(app.db))

// cwd => especifica o diretorio padrao para o consign
// verbose => omite a inicialização do consign
consign({ cwd: 'src', verbose: false })
  .include('./config/middlewares.js')
  .then('./routes')
  .then('./config/routes.js')
  .into(app)

app.get('/', (req, res) => { res.status(200).send() })

app.db.on('query', (query) => {
  console.log({ sql: query.sql, bindings: query.bindings ? query.bindings.join(',') : '' })
}).on('query-response', (response) => {
  console.log(response)
})

module.exports = app