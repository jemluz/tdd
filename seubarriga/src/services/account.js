const ValidationError = require('../errors/ValidationError')

module.exports = app => {
  const save = async (account) => {
    if (!account.name) throw new ValidationError('Nome é um campo obrigatório.')
    // * retorna todos os dados inseridos no banco
    return app.db('accounts').insert(account, '*')
  }

  const findAll = () => {
    return app.db('accounts')
  }

  const findOne = (filter = {}) => {
    return app.db('accounts').where(filter).first()
  }

  const update = (id, account) => {
    return app.db('accounts')
      .where({ id })
      .update(account, '*')
  }

  const remove = (id) => {
    return app.db('accounts')
      .where({ id })
      .del()
  }

  return { 
    save, findAll, findOne, update, remove
  }
}