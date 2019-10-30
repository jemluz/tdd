// modulo da aplicação utilizado pelo teste e pelo servidor

const app = require('express')()

app.get('/', (req, res) => { res.status(200).send() })

module.exports = app