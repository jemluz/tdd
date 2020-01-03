const request = require('supertest')
const app = require('../../src/app')

const jwt = require('jwt-simple') 
const secret = 'Segredo!'

const MAIN_ROUTE = '/v1/accounts'
let user
let user2

// beforeEache/All são metodos reservados executados antes dos testes
beforeEach(async () => {
  const res = await app.services.user.save({ name: 'User Account', mail: `${Date.now()}@mail.com`, password: '123' })
  user = { ...res[0] }
  user.token = jwt.encode(user, secret)

  const res2 = await app.services.user.save({ name: 'User Account #2', mail: `${Date.now()}@mail.com`, password: '123' })
  user2 = { ...res2[0] }
})

// TESTES DA API -----------------------------------------------------------------------------------------------------
test('Deve inserir uma conta', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Acc #1' })
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Acc #1')
    })
})

test('Não deve inserir uma conta sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ })
    .set('authorization', `bearer ${user.token}`)
    .then(result => {
      expect(result.status).toBe(400)
      expect(result.body.error).toBe('Nome é um campo obrigatório.')
    })
})

// TESTES DO BANCO ---------------------------------------------------------------------------------------------------
test.skip('Deve listar todas as contas', () => {
  return app.db('accounts')
    .insert({ name: 'Acc List', user_id: user.id })
    .then(() => request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`))
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
    })
})

// esse teste irá substituir o "Deve listar todas as contas"
test('Deve listar apenas as contas do usuário.', () => { 
  return app.db('accounts')
    .insert([
      { name: 'Acc User #1', user_id: user.id },
      { name: 'Acc User #2', user_id: user2.id }
    ])
    .then(() => request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`))
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(1)
      expect(res.body[0].name).toBe('Acc User #1')
    })
})

test('Deve retornar uma conta por Id', () => {
  return app.db('accounts')
    .insert({ name: 'Acc By Id', user_id: user.id }, ['id'])
    .then(acc => request(app)
      .get(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`))
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
      .send({ name: 'Acc Updated' })
      .set('authorization', `bearer ${user.token}`))
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Acc Updated')
    })
})

test('Deve remover uma conta', () => {
  return app.db('accounts')
    .insert({ name: 'Acc To Remove', user_id: user.id }, ['id'])
    .then(acc => request(app)
      .delete(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then(res => {
      expect(res.status).toBe(204)
    })
})

test('Não deve inserir uma conta de nome duplicado, para um mesmo usuário.', () => {
  return app.db('accounts')
    .insert({ name: 'Acc duplicada', user_id: user.id })
    .then(() => request(app)
      .post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Acc duplicada' }))
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Já existe uma conta com esse nome.')
    })
})

test('Não deve retornar uma conta de outro usuário.', () => {
  return app.db('accounts')
    .insert({ name: 'Acc User #2', user_id: user2.id }, ['id'])
    .then(acc => request(app)
      .get(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then(res => {
      expect(res.status).toBe(403)
      expect(res.body.error).toBe('O usuário não tem permissão para acessar esse recurso.')
    })
})

test('Não deve alterar uma conta de outro usuário.', () => {
  return app.db('accounts')
    .insert({ name: 'Acc User #2', user_id: user2.id }, ['id'])
    .then(acc => request(app)
      .put(`${MAIN_ROUTE}/${acc[0].id}`)
      .send({ name: 'Acc Updated' })
      .set('authorization', `bearer ${user.token}`))
    .then(res => {
      expect(res.status).toBe(403)
      expect(res.body.error).toBe('O usuário não tem permissão para acessar esse recurso.')
    })
})

test('Não deve remover uma conta de outro usuário.', () => {
  return app.db('accounts')
    .insert({ name: 'Acc User #2', user_id: user2.id }, ['id'])
    .then(acc => request(app)
      .delete(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then(res => {
      expect(res.status).toBe(403)
      expect(res.body.error).toBe('O usuário não tem permissão para acessar esse recurso.')
    })
})