const express = require('express')


module.exports = app => {
  const accountsRouter = express.Router()

  accountsRouter.post('/', async (req, res, next) => {
    app.services.account.save({ ...req.body, user_id: req.user.id })
      .then(result => { 
        return res.status(201).json(result[0])
      })
      .catch(err => next(err))
  })

  accountsRouter.get('/', (req, res, next) => {
    app.services.account.findAll(req.user.id)
      .then(result => { res.status(200).json(result) })
      .catch(err => next(err))
  })

  accountsRouter.get('/:id', (req, res, next) => {
    app.services.account.findOne({ id: req.params.id })
      .then(result => { res.status(200).json(result) })
      .catch(err => next(err))
  })

  accountsRouter.put('/:id', (req, res, next) => {
    app.services.account.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err))
  })

  accountsRouter.delete('/:id', (req, res, next) => {
    app.services.account.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch(err => next(err))
  })

  return accountsRouter
}