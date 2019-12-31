const ValidationError = require('../errors/ValidationError')

module.exports = (app) => {
  // passa um parametro facultativo
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select()
  }

  const save = async (user) => {
    // if (!user.name) return { error: 'Nome é um campo obrigatório.' }

    if (!user.name) throw new ValidationError('Nome é um campo obrigatório.')
    if (!user.mail) throw new ValidationError('Email é um campo obrigatório.')
    if (!user.password) throw new ValidationError('Senha é um campo obrigatório.')
    
    const userDb = await findAll({ mail: user.mail })
    if (userDb && userDb.length > 0) throw new ValidationError('Já existe um usuário com esse email.')

    return app.db('users').insert(user, '*')
  }

  return { findAll, save }
}