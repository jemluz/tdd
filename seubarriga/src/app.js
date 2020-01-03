// modulo da aplicação utilizado pelo teste e pelo servidor
const app = require('express')()
const consign = require('consign')

const knex = require('knex')
const knexfile = require('../knexfile')

app.db = knex(knexfile.test)

// cwd => especifica o diretorio padrao para o consign
// verbose => omite a inicialização do consign
consign({ cwd: 'src', verbose: false })
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/routes.js')
  .into(app)

app.get('/', (req, res) => { res.status(200).send() })

// middleware para tratamento de erros
app.use((err, req, res, next) => {
  const { name, message } = err
  if (name === 'ValidationError') res.status(400).json({ error: message })
  else res.status(500).json({ name, message, stack })
  next(err)
})

// middleware/rota genérica (tratamento 404)
// app.use((req, res) => {
//   res.status(404).send('Não te conheço.')
// })

// app.db.on('query', (query) => {
//   console.log({ sql: query.sql, bindings: query.bindings ? query.bindings.join(',') : '' })
// }).on('query-response', (response) => {
//   console.log(response)
// })

module.exports = app