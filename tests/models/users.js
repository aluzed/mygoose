"use strict";
const bcrypt  = require('bcrypt');
const salt    = 'wAuSo15n_o6u8514a5&4ds1a';
const mygoose = require('../../dev');
const Schema  = mygoose.Schema;

const UsersSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, require: true },
  last_connection: { type: Date },
  created_at: { type: Date },
  modified_at: { type: Date }
});

UsersSchema.pre('save', function(tmpUser){
  if(!tmpUser.id && !!tmpUser.password) {
    tmpUser.password = bcrypt.hashSync(tmpUser.password + salt, 10);
  }
  return tmpUser;
});

module.exports = mygoose.model('users', UsersSchema);
