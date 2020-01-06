const express = require('express')
const RecursoIndevidoError = require('../errors/RecursoIndevidoError')

module.exports = app => {
  const transactionsRouter = express.Router()

  transactionsRouter.get('/', (req, res, next) => {
    app.services.transaction.find(req.user.id)
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  })

  return transactionsRouter
}
