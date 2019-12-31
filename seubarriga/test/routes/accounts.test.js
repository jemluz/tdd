const request = require('supertest')
const app = require('../../src/app')

const MAIN_ROUTE = '/accounts'
let user

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User Account', mail: `${Date.now()}@mail.com`, password: '123456' })

  user = { ...res[0] }
})

test('Deve inserir uma conta', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Acc #1', user_id: user.id })
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Acc #1')
    })
})

test('Deve listar todas as contas', () => {
  return app.db('accounts')
    .insert({ name: 'Acc List', user_id: user.id })
    .then(() => request(app).get(MAIN_ROUTE))
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
    })
})

test('Deve retornar uma conta por Id', () => {
  return app.db('accounts')
    .insert({ name: 'Acc By Id', user_id: user.id }, ['id'])
    .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`))
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Acc By Id')
      expect(res.body.user_id).toBe(user.id)
    })
})

test('Deve alterar uma conta', () => {
  return app.db('accounts')
    .insert({ name: 'Acc To Update', user_id: user.id }, ['id'])
    .then(acc => request(app)
      .put(`${MAIN_ROUTE}/${acc[0].id}`)
      .send({ name: 'Acc Updated' }))
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Acc Updated')
    })
})

test('Deve remover uma conta', () => {
  return app.db('accounts')
    .insert({ name: 'Acc To Remove', user_id: user.id }, ['id'])
    .then(acc => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`))
    .then(res => {
      expect(res.status).toBe(204)
    })
})

test('Não deve inserir uma conta sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ user_id: user.id })
    .then(result => {
      expect(result.status).toBe(400)
      expect(result.body.error).toBe('Nome é um campo obrigatório.')
    })
})

// testes futuros
test.skip('Não deve inserir uma conta de nome duplicado, para um mesmo usuário.', () => {})
test.skip('Deve listar apenas as contas do usuário.', () => { 
  // esse teste irá substituir a listagem de todas as contas, que é uma falha de segurança pois possibilita brechas para usuários manipularem contas que não são as suas 
})
test.skip('Não deve retornar uma conta de outro usuário.', () => {})
test.skip('Não deve alterar uma conta de outro usuário.', () => {})
test.skip('Não deve remover uma conta de outro usuário.', () => {})