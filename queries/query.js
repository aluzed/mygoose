/**
* Query
*
* Query runner library
*
* Copyright(c) 2017 Alexandre PENOMBRE
* <aluzed_AT_gmail.com>
*/
"use strict";
const mysql      = require('mysql');
const Mygoose    = require('./index');


class Query {
  /**
  * constructor
  *
  * @param {String} queryStr
  */
  constructor(queryStr) {
    if(!!queryStr)
      this.queryStr   = queryStr;

    this.connection = null;
    this.dbConfig   = Mygoose._dbConfig;
  }

  /**
  * run Method
  *
  * Run a sql query
  *
  * @param {String} queryStr
  * @return {Promise}
  */
  run(queryStr) {
    if(!this.connection)
      throw new Error('Error, connection must be initialized');

    return new Promise((resolve, reject) => {
      this.connection.query(queryStr, function (error, results, fields) {
        if (error) {
          this.connection.end();
          reject(error);
        }
        resolve({results, fields});
      });
    });
  }

  /**
  * init Method
  *
  * Initialize the connection
  *
  * @param {Object|null} options
  */
  init(options) {
    // Concat options
    if(typeof options !== "undefined")
      this.dbConfig = Object.assign(this.dbConfig, options);

    this.connection = mysql.createConnection(this.dbConfig);
    this.connection.connect();
  }

  /**
  * close Method
  *
  * Close the connection
  */
  close() {
    if(!this.connection) throw new Error('Error, connection must be initialized');
    this.connection.end();
  }

  /**
   * runOnly Method
   *
   * @param {String} queryStr
   * @param {Object} options
   * @return {Object} query result
   */
  runOnce(queryStr, options) {
    this.init(options);
    return this.run(queryStr).then(resObject => {
      this.close();
      return resObject;
    });
  }

  /**
  * exec Method
  *
  * @param {Function} callback
  */
  exec(callback) {
    if(!!this.queryStr) {
      this.init();

      this.run(this.queryStr).then(resObject => {
        this.close();
        callback(null, resObject.results);
      }).catch(err => {
        callback(err);
      });
    }
  }

}

module.exports = Query;
