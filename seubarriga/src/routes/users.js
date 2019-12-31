module.exports = (app) => {
  const getAll = (req, res) => {
    app.services.user.findAll()
      .then(result => res.status(200).json(result))
  }

  // o retorno do mysql é um número, por padrão.
  const create = async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body)
      return res.status(201).json(result[0])
    } catch (err) {
      return next(err)
    }
  }

  return { getAll, create }
}