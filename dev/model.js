/**
* Mysql Model
*
* Mysql Model Class
*
* Copyright(c) 2017 Alexandre PENOMBRE
* <aluzed_AT_gmail.com>
*/
const insert = require('./queries/insert');
const update = require('./queries/update');
const remove = require('./queries/remove');
const select = require('./queries/select');
const Query  = require('./queries/query');

module.exports = (table, schema) => {

  return class MygooseModel {
    /**
    * MygooseModel Constructor
    *
    * @param {Object} modelObject
    */
    constructor(modelObject) {
      this.id = null;
      this.__proto__.schema = schema;
      this.__proto__.table = table;

      this.__proto__._setValues = (values) => {
        for(let field in values) {
          this[field] = values[field];
        }
      };

      // assign pre hooks
      if(!!this.__proto__.schema.hooks.pre.init) {
        const val = this.__proto__.schema.hooks.pre.init(this);
        for (let field in val) {
          this[field] = val[field];
        }
      }

      for(let field in modelObject) {
        this[field] = modelObject[field];
      }

      // assign  post hooks
      if(!!this.__proto__.schema.hooks.post.init) {
        const val = this.__proto__.schema.hooks.post.init(this);
        for (let field in val) {
          this[field] = val[field];
        }
      }

      let query = new Query();
      query.init();
      query.run('show tables').then((res) => {
        console.log(res.results);
      });
    }

    static find() {

    }

    static findOne() {

    }

    static findById(id, callback) {
      return (!callback) ?
         select(this.__proto__.table, this, {
          where: [
            this.__proto__.table + '.id = ' + id
          ]
        }) :
        select(this.__proto__.table, this, {
          where: [
            this.__proto__.table + '.id = ' + id
          ]
        }).then(values => {
          callback(null, values);
        }).catch(err => {
          callback(err);
        });
    }

    static findByIdAndUpdate(id, newObject, callback) {

    }

    static findByIdAndRemove() {

    }

    save(callback) {
      new Promise((resolve, reject) => {
        // If has pre hook, exec the callback first
        if(!!this.__proto__.schema.hooks.pre.save) {
          this.__proto__.schema.hooks.pre.save(resolve);
        }
        // Or resolve
        resolve();
      }).then(() => {
        // If callback exists
        if(!!callback) {
          // Insert Case
          if (!this.id) {
            insert(this.__proto__.table, this).then(values => {
              this.__proto__._setValues(values);

              // If there is a hook after save
              if (!!this.__proto__.schema.hooks.post.save) {
                this.__proto__.schema.hooks.post.save(this);
              }
              callback(null, this);

            }).catch(err => {
              callback(err);
            });
          }
          // Update Case
          else {
            update(this.__proto__.table, this).then(values => {
              this.__proto__._setValues(values);

              // If there is a hook after save
              if (!!this.__proto__.schema.hooks.post.save) {
                this.__proto__.schema.hooks.post.save(this);
              }
              callback(null, this);

            }).catch(err => {
              callback(err);
            });
          }
        }
        // If callback does not exist
        else {
          if(!this.id) {

          }
        }
      });

    }

    remove() {
      new Promise((resolve, reject) => {
        // If has pre hook, exec the callback first
        if(!!this.__proto__.schema.hooks.pre.remove)
          this.__proto__.schema.hooks.pre.remove(resolve);

        // Or resolve
        resolve();
      }).then(() => {
        remove(this.__proto__.table, this.id).then(values => {
          this.__proto__._setValues(values);
          if (!!this.__proto__.schema.hooks.post.save) {
            this.__proto__.schema.hooks.post.save(this);
          }
          callback(null, this);
        }).catch(err => {
          callback(err);
        });
      });
    }
  };

};
