const request = require('supertest')
const app = require('../../src/app')

const jwt = require('jwt-simple') 
const secret = 'Segredo!'

const mail = `${Date.now()}@mail.com`
let user

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User Account', mail: `${Date.now()}@mail.com`, password: '123'})
  user = { ...res[0] }
  user.token = jwt.encode(user, secret)
})

test('Deve listar todos os usuários', () => {
  return request(app).get('/users')
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
      // expect(res.body[0]).toHaveProperty('name', 'John Doe')
    })
})

test('Deve inserir usuário', () => {
  return request(app).post('/users')
    .send({ name: 'Walter Mitty', mail, password: '123' })
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Walter Mitty')
      expect(res.body).not.toHaveProperty('password')
    })
})

test('Deve armazenar senha criptografada', async () => {
  const res = await request(app).post('/users')
    .send({ name: 'Walter Mitty', mail: `${Date.now()}@gmail.com`, password: '123' })
    .set('authorization', `bearer ${user.token}`)

  expect(res.status).toBe(201)

  const { id } = res.body
  const userDB = await app.services.user.findOne({ id })
  expect(userDB.password).not.toBeUndefined()
  expect(userDB.password).not.toBe('123')
})

// test com request
test('Não deve inserir usuário sem nome', () => {
  return request(app).post('/users')
    .send({ mail: 'walter@mail.com', password: '123456' })
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Nome é um campo obrigatório.')
    })
})

// teste com chamada assincrona
test('Não deve inserir usuário sem email', async () => {
  const result = await request(app).post('/users')
    .send({ name: 'Walter Mitty', password: '123456'})
    .set('authorization', `bearer ${user.token}`)

  expect(result.status).toBe(400)
  expect(result.body.error).toBe('Email é um campo obrigatório.')
})

// teste com done
test('Não deve inserir usuário sem senha', (done) => {
  request(app).post('/users')
    .send({ name: 'Walter Mitty', mail: 'walter@mail.com' })
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Senha é um campo obrigatório.')
      done()
    })
})

test('Não deve inserir usuário com email existente', () => {
  return request(app).post('/users')
    .send({ name: 'Walter Mitty', mail, password: '123' })
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Já existe um usuário com esse email.')
    })
})