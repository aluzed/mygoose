/**
* Insert Data
*
* Insert data in our mysql database
*
* Copyright(c) 2017 Alexandre PENOMBRE
* <aluzed_AT_gmail.com>
*/
const Query         = require('./query');
const dateHelpers   = require('../helpers/dates');

module.exports = (table, model) => {
  const schema = model.schema;
  let tmpQuery = "INSERT INTO " + table + " (";
  let tmpFields = "";
  let tmpValues = "";

  // Check required
  for(let field in schema) {
    if(!!schema[field].required && !model[field]) {
      throw new Error('Error, ' + field + ' marqued as required but missing');
    }
    // Sanitize schema
    switch (schema[field]) {
      case String : schema[field] = { type: String }; break;
      case Boolean: schema[field] = { type: Boolean }; break;
      case Number: schema[field] = { type: Number }; break;
      case Date: schema[field] = { type: Date }; break;
      default: break;
    }
  }

  // Add default value for created_at while inserting data
  if (!model.created_at && !!schema.created_at) {
    model.created_at = dateHelpers.toDatetimeSQL(Date.now());
  }

  // Add default value for modified_at while inserting data
  if (!model.modified_at && !!schema.modified_at) {
    model.modified_at = dateHelpers.toDatetimeSQL(Date.now());
  }

  for (let field in model) {
    // Only if the field exists in the model table
    if(!!schema[field]) {
      if (tmpFields !== "") {
        tmpFields += ", ";
      }
      tmpFields +=  table + "." + field;

      if (tmpValues !== "") {
        tmpValues += ", ";
      }

      switch(schema[field].type) {
        case Date :
          // Convert JS date to mysql string
          tmpValues += "\'" + dateHelpers.toDatetimeSQL(model[field]) + "\'";
          break;
        case Boolean :
          // Replace the true false by 1 or 0
          tmpValues += model[field] ? "\'" + 1 + "\'" : "\'" + 0 + "\'";
          break;
        default :
          tmpValues += "\'" + model[field] + "\'";
          break;
      }
    }
  }

  tmpQuery += tmpFields + ") VALUES (" + tmpValues + ");";

  return new Promise((resolve, reject) => {
    let query = new Query();
    query.init();
    query.exec(tmpQuery).then(response => {
      if (!!response.results.insertId) {
        query.exec(`SELECT * FROM ${table} WHERE ${table}.id = ${response.results.insertId};`).then(res => {
          query.close();
          resolve(res.results[0]);
        }).catch(err => {
          reject(err);
        });
      }
    });
  });
};
