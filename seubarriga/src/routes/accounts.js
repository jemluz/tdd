module.exports = app => {
  const create = async (req, res) => {
    // app.services.account.save(req.body)
    //   .then(result => { 
    //     return res.status(201).json(result[0])
    //   })
    //   .catch(err => { return res.status(400).json(err) })

    const result = app.services.account.save(req.body)
    return res.status(201).json(result[0])
  }

  return { create }
}