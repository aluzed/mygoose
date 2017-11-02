const mygoose = require('../dev');
const config = require('./configs');
const assert = require('assert');

mygoose.connect(config.mysqlDb);

describe('Test mygoose model', () => {
  it('Should generate a mygoose model and a table in database', () => {
    const UserModel = require('./models/users');
    let user = new UserModel();
  });
});
