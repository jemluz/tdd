
exports.seed = (knex) => {
  return knex('transactions').del()
    .then(() => knex('transfers').del())
    .then(() => knex('accounts').del())
    .then(() => knex('users').del())
    .then(() => knex('users').insert([
      { id: 10001, name: 'User #1', mail: 'user1@mail.com', password: '$2a$10$4pcsjD86JEO4FGpMcKJtaucDyDiIcPDaTKrFVcp.UHZ/yf8lou.Im' },
      { id: 20001, name: 'User #2', mail: 'user2@mail.com', password: '$2a$10$4pcsjD86JEO4FGpMcKJtaucDyDiIcPDaTKrFVcp.UHZ/yf8lou.Im' }
    ]))
    .then(() => knex('accounts').insert([
      { id: 10001, name: 'Acc O #1', user_id: 10001 },
      { id: 10002, name: 'Acc D #1', user_id: 10001 },
      { id: 20001, name: 'Acc O #2', user_id: 20001 },
      { id: 20002, name: 'Acc D #2', user_id: 20001 }
    ]))
    .then(() => knex('transfers').insert([
      { id: 10001, description: 'Transfer #1', date: new Date(), ammount: 100, user_id: 10001, acc_origin_id: 10001, acc_destiny_id: 10002 },
      { id: 20001, description: 'Transfer #2', date: new Date(), ammount: 200, user_id: 20001, acc_origin_id: 20001, acc_destiny_id: 20002 }
    ]))
    .then(() => knex('transactions').insert([
      { description: 'Transfer from Acc O #1', date: new Date(), ammount: 100, type: 'I', acc_id: 10002, transfer_id: 10001 },
      { description: 'Transfer from Acc D #1', date: new Date(), ammount: -100, type: 'O', acc_id: 10001, transfer_id: 10001 },
      { description: 'Transfer from Acc O #2', date: new Date(), ammount: 200, type: 'I', acc_id: 20002, transfer_id: 20001 },
      { description: 'Transfer from Acc D #2', date: new Date(), ammount: -200, type: 'O', acc_id: 20001, transfer_id: 20001 }
    ]))
};
