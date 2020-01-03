const request = require('supertest')
const app = require('../../src/app')

test('Deve receber token ao logar', () => {
  const mail = `${Date.now()}@mail.com`

  return app.services.user.save({ name: 'Walter', mail, password: '123'})
    .then(() => request(app)
      .post('/auth/signin')
      .send({ mail, password: '123' }))
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
    })
})

test('Não deve autenticar usuário com senha errada', () => {
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

test('Não deve autenticar usuário inexistente', () => {
  return request(app).post('/auth/signin')
    .send({ mail: 'naoexiste@mail.com', password: '321' })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Usuário ou senha errados.')
    })
})

test('Não deve acessar uma rota protegida sem token', () => {
  return request(app).get('/v1/users')
    .then(res => {
      // 401 alguem não autenticado tentando acessar a aplicação
      expect(res.status).toBe(401)
    })
})

test('Deve criar usuário via signup', () => {
  return request(app).post('/auth/signup')
    .send({ name: 'Walter', mail: `${Date.now()}@mail.com`, password: '123' })
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Walter')
      expect(res.body).toHaveProperty('mail')
      expect(res.body).not.toHaveProperty('password')
    })
})