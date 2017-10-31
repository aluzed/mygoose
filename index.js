/**
 * Mygoose Export Object
 */
const mygooseModel  = require('./model');
const mygooseSchema = require('./schema');
const Query         = require('./queries/query');

let conf = {
    db: null
};

module.exports = {
  /**
   * Connect Method
   *
   * Put the dbConfig in the process.env.Mygoose.dbConfig
   */
  connect: (dbConfig) => {
      conf.db = dbConfig;
  },
  // model.js
  model: mygooseModel,
  // schema.js
  Schema: mygooseSchema,
  // local dbConfig
  _dbConfig: conf.db,
  // run a query
  runOnce: (queryStr, options) => {
    let query = new Query();
    return query.runOnce(queryStr, options);
  }
};
