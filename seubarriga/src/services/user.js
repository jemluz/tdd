const bcrypt = require('bcrypt-nodejs')
const ValidationError = require('../errors/ValidationError')

module.exports = (app) => {
  // passa um parametro facultativo
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'mail'])
  }

  const findOne = (filter = {}) => {
    return app.db('users').where(filter).select().first()
  }

  const getPassHash = (password) => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
  }

  const save = async (user) => {
    // if (!user.name) return { error: 'Nome é um campo obrigatório.' }

    if (!user.name) throw new ValidationError('Nome é um campo obrigatório.')
    if (!user.mail) throw new ValidationError('Email é um campo obrigatório.')
    if (!user.password) throw new ValidationError('Senha é um campo obrigatório.')
    
    const userDb = await findOne({ mail: user.mail })
    if (userDb) throw new ValidationError('Já existe um usuário com esse email.')

    const newUser = { ...user }
    newUser.password = getPassHash(user.password)
    return app.db('users').insert(newUser, ['id', 'name', 'mail'])
  }

  return { findAll, findOne, save }
}