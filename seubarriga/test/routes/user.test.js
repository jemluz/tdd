const request = require('supertest')
const app = require('../../src/app')

test('Deve listar todos os usuários', () => {
  return request(app).get('/users')
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
      // expect(res.body[0]).toHaveProperty('name', 'John Doe')
    })
})

test('Deve inserir usuário com sucesso', () => {
  const mail = `${Date.now()}@mail.com`

  return request(app).post('/users')
    .send({ name: 'Walter Mitty', mail, password: '123' })
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Walter Mitty')
    })
})