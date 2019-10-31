// modulo da aplicação utilizado pelo teste e pelo servidor
const app = require('express')()
const consign = require('consign')

const knex = require('knex')
const knexfile = require('../knexfile')
app.db = knex(knexfile)

// cwd => especifica o diretorio padrao para o consign
// verbose => omite a inicialização do consign
consign({ cwd: 'src', verbose: false })
  .include('./config/middlewares.js')
  .then('./routes')
  .then('./config/routes.js')
  .into(app)

app.get('/', (req, res) => { res.status(200).send() })

module.exports = app