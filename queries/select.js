/**
* Select Data
*
* Select data in our mysql database
*
* Copyright(c) 2017 Alexandre PENOMBRE
* <aluzed_AT_gmail.com>
*/
const Query = require('./query');

module.exports = (table, model, options) => {
  const schema = model.schema;

  let tmpQuery = "SELECT ";

  for(let field in schema) {
    tmpQuery += (tmpQuery === "SELECT ") ? (table + '.' + field) : (', ' + table + '.' + field);
  }

  tmpQuery += " FROM " + table;

  if(!!options.where) {
    let tmpWhere = "";
    for(let w in options.where) {
      tmpWhere += (tmpWhere === "") ? options.where[w] : (" AND " + options.where[w]);
    }
    tmpQuery += " WHERE " + tmpWhere;
  }

  if(!!options.group) {
    tmpQuery += " GROUP BY " + options.group;
  }

  if(!!options.order) {
    let tmpOrder = "";
    for(let o in options.order) {
      tmpOrder += (tmpOrder === "") ? options.order[o] : (", " + options.order[o]);
    }
    tmpQuery += " ORDER BY " + tmpOrder;
  }

  if(!!options.limit) {
    tmpQuery += " LIMIT " + options.limit;
  }

  if(!!options.offset) {
    tmpQuery += " OFFSET " + options.offset;
  }

  return new Promise((resolve, reject) => {
    Query.init();
    Query.exec(tmpQuery).then(response => {
      resolve(response.results);
    }).catch(err => {
      reject(err);
    });
  });
};
