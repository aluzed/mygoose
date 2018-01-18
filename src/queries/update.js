/**
* Insert Data
*
* Insert data in our mysql database
*
* Copyright(c) 2017 Alexandre PENOMBRE
* <aluzed_AT_gmail.com>
*/
const Query         = require('./query');
const path          = require('path');
const _TABLES_PATH_ = path.join(__dirname, '../../tables');
const dateHelpers   = require('../helpers/dates');
const Promise       = require('bluebird');

module.exports = (table, model) => {
  if(!model.id) {
    throw new Error('Error, unable to update an item without id (NO PRIMARY KEY)');
  }
  const currentId = model.id;
  const schema = model.schema;
  const modelTable = require(tablePath);
  let tmpQuery = "UPDATE " + table + " SET ";
  let tmpValues = "";

  // Check required
  for (let field in schema) {
    if (!!schema[field].required && !values[field])  {
      throw new Error('Error, ' + field + ' marqued as required but missing');
    }
    // Sanitize schema
    switch (schema[field]) {
      case String: schema[field] = { type: String }; break;
      case Boolean: schema[field] = { type: Boolean }; break;
      case Number: schema[field] = { type: Number }; break;
      case Date: schema[field] = { type: Date }; break;
      default: break;
    }
  }

  // Add default value for modified_at while inserting data
  if (!!schema.modified_at) {
    model.modified_at = dateHelpers.toDatetimeSQL(Date.now());
  }

  for (let field in model) {
    // Only if the field exists in the model table
    if (!!schema[field] && field !== "id") {
      if (tmpValues !== "") {
        tmpValues += ", ";
      }

      switch (schema[field].type) {
        case Date:
        // Convert JS date to mysql string
        tmpValues += table + '.' + field + "=\'" + dateHelpers.toDatetimeSQL(model[field]) + "\'";
        break;
        case Boolean:
        // Replace the true false by 1 or 0
        tmpValues += table + '.' + field;
        tmpValues += (model[field]) ? "=\'" + 1 + "\'" : "=\'" + 0 + "\'";
        break;
        default:
        tmpValues += table + '.' + field + "=\'" + model[field] + "\'";
        break;
      }
    }
  }

  tmpQuery += tmpValues + " WHERE " + table + ".id=\'" + currentId + "\';";

  return new Promise((resolve, reject) => {
    Query.init();
    Query.exec(tmpQuery).then(response => {
      Query.exec(`SELECT * FROM ${table} WHERE ${table}.id = ${currentId};`).then(res => {
        Query.close();
        resolve(res.results[0]);
      }).catch(err => {
        reject(err);
      });
    });
  });
};
