// middlewares => funções que são executadas no meio de uma requisição
const bodyParser = require('body-parser')

module.exports = app => {
  app.use(bodyParser.json())
}
