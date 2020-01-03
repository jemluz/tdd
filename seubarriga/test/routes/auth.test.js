const request = require('supertest')
const app = require('../../src/app')

test('Deve receber token ao logar', () => {
  const mail = `${Date.now()}@mail.com`

  return app.services.user.save({ name: 'Walter', mail, password: '123'})
    .then(() =>  request(app)
      .post('/auth/signin')
      .send({ mail, password: '123' }))
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
    })
})

test('Não devve autenticar usuário com senha errada', () => {
  const mail = `${Date.now()}@mail.com`

  return app.services.user.save({ name: 'Walter', mail, password: '123'})
  .then(() =>  request(app)
    .post('/auth/signin')
    .send({ mail, password: '321' }))
  .then(res => {
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Usuário ou senha errados.')
  })
})

test('Não devve autenticar usuário inexistente', () => {
  return request(app).post('/auth/signin')
    .send({ mail: 'naoexiste@mail.com', password: '321' })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Usuário ou senha errados.')
    })
})

test('Não deve acessar uma rotta protegida sem token', () => {
  return request(app).get('/users')
    .then(res => {
      // 401 alguem não autenticado tentando acessar a aplicação
      expect(res.status).toBe(401)
    })
})