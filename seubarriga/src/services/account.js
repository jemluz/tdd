module.exports = app => {
  const save = async (account) => {
    // * retorna todos os dados inseridos no banco
    return app.db('accounts').insert(account, '*')
  }

  return { save }
}