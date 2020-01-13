const express = require('express')
const RecursoIndevidoError = require('../errors/RecursoIndevidoError')

module.exports = app => {
  const transactionsRouter = express.Router()

  transactionsRouter.param('id', (req, res, next) => {
    app.services.transaction.find(req.user.id, { 'transactions.id': req.params.id })
      .then(result => {
        if (result.length > 0) next()
        else throw new RecursoIndevidoError()
      }).catch(err => next(err))
  })

  transactionsRouter.get('/', (req, res, next) => {
    app.services.transaction.find(req.user.id)
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  })

  transactionsRouter.get('/:id', (req, res, next) => {
    app.services.transaction.findOne({ id: req.params.id })
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  })

  transactionsRouter.post('/', (req, res, next) => {
    app.services.transaction.save(req.body)
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err))
  })

  transactionsRouter.put('/:id', (req, res, next) => {
    app.services.transaction.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err))
  })

  transactionsRouter.delete('/:id', (req, res, next) => {
    app.services.transaction.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch(err => next(err))
  })
  
  return transactionsRouter
}
