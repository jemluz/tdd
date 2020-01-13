const request = require('supertest')
const app = require('../../src/app')

const jwt = require('jwt-simple') 
const secret = 'Segredo!'

const MAIN_ROUTE = '/v1/transactions'

let user
let user2
let accUser
let accUser2

beforeAll(async () => {
  await app.db('transactions').del()
  await app.db('accounts').del()
  await app.db('users').del()

  const res1 = await app.db('users').insert({ name: 'User #1', mail: 'user@mail.com', password: '$2a$10$4pcsjD86JEO4FGpMcKJtaucDyDiIcPDaTKrFVcp.UHZ/yf8lou.Im' }, '*')
  const res2 = await app.db('users').insert({ name: 'User #2', mail: 'user2@mail.com', password: '$2a$10$4pcsjD86JEO4FGpMcKJtaucDyDiIcPDaTKrFVcp.UHZ/yf8lou.Im' }, '*')

  user = { ...res1[0] }
  user2 = { ...res2[0] }

  delete user.password
  user.token = jwt.encode(user, secret)

  const res3 = await app.db('accounts').insert({ name: 'Acc #1', user_id: user.id }, '*')
  const res4 = await app.db('accounts').insert({ name: 'Acc #2', user_id: user2.id }, '*')

  accUser = { ...res3[0] }
  accUser2 = { ...res4[0] }
})

// TESTES DA API -----------------------------------------------------------------------------------------------------
test('Deve inserir uma transação', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ description: 'New T', date: new Date(), ammount: 100, type: 'I', acc_id: accUser2.id })
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.acc_id).toBe(accUser2.id)
    })
})

// TESTES DO BANCO ---------------------------------------------------------------------------------------------------
test('Deve listar apenas as transações do usuário', () => {
  return app.db('transactions').insert([
    { description: 'T1', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id },
    { description: 'T2', date: new Date(), ammount: 200, type: 'O', acc_id: accUser2.id }
  ]).then(() => request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].description).toBe('T1')
    }))
})

test('Deve retornar uma transação por ID', () => {
  return app.db('transactions')
    .insert({ description: 'T ID', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id }, ['id'])
    .then(trans => request(app)
      .get(`${MAIN_ROUTE}/${trans[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.id).toBe(trans[0].id)
        expect(res.body.description).toBe('T ID')
      }))
})

test('Deve alterar uma transação', () => {
  return app.db('transactions')
    .insert({ description: 'To Update', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id }, ['id'])
    .then(trans => request(app)
      .put(`${MAIN_ROUTE}/${trans[0].id}`)
      .send({ description: 'Updated'})
      .set('authorization', `bearer ${user.token}`)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.description).toBe('Updated')
      }))
})

test('Deve remover uma transação', () => {
  return app.db('transactions')
    .insert({ description: 'To Remove', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id }, ['id'])
    .then(trans => request(app)
      .delete(`${MAIN_ROUTE}/${trans[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then(res => {
        expect(res.status).toBe(204)
      }))
})

test('Não deve remover uma transação de outro usuário', () => {
  return app.db('transactions')
    .insert({ description: 'To Remove', date: new Date(), ammount: 100, type: 'I', acc_id: accUser2.id }, ['id'])
    .then(trans => request(app)
      .delete(`${MAIN_ROUTE}/${trans[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then(res => {
        expect(res.status).toBe(403)
        expect(res.body.error).toBe('O usuário não tem permissão para acessar esse recurso.')
      }))
})