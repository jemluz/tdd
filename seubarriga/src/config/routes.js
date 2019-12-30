module.exports = app => {
  app.route('/users')
    .get(app.routes.users.getAll)
    .post(app.routes.users.create)

  app.route('/accounts')
    .get(app.routes.accounts.getAll)
    .post(app.routes.accounts.create)

  app.route('/accounts/:id')
    .get(app.routes.accounts.getOne)
    .put(app.routes.accounts.update)
    .delete(app.routes.accounts.remove)
}