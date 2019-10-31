module.exports = app => {
  const findAll = (req, res) => {
    app.db('users').select()
      .then(result => res.status(200).json(result))
  }

  // o retorno do mysql é um número, por padrão.
  const create = async (req, res) => {
    const result = await app.db('users').insert(req.body)
      .then(res.status(201).json(req.body))
      .catch[err => res.status(500).send(err)]

    return result
  }

  return { findAll, create }
}