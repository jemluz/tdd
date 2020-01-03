const express = require('express')

module.exports = app => {
  app.use('/auth', app.routes.auth.authRouter)
  app.use('/users', app.routes.users.usersRouter)
}