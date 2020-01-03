const express = require('express')
const ValidationError = require('../errors/ValidationError')

const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')
const secret = 'Segredo!'

module.exports = app => {
  const authRouter = express.Router()
  
  authRouter.post('/signin', (req, res, next) => {
    app.services.user.findOne({ mail: req.body.mail })
      .then(user => {
        if (!user) throw new ValidationError('Usuário ou senha errados.')

        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user.id,
            name: user.name,
            mail: user.mail
          }

          const token = jwt.encode(payload, secret)
          res.status(200).json({ token })
        } else throw new ValidationError('Usuário ou senha errados.')
      }).catch(err => next(err))
  })

  // o retorno do mysql é um número, por padrão.
  authRouter.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body)
      return res.status(201).json(result[0])
    } catch (err) {
      return next(err)
    }
  })

  return authRouter 
}