/**
* Mysql Model
*
* Mysql Model Class
*
* Copyright(c) 2017 Alexandre PENOMBRE
* <aluzed_AT_gmail.com>
*/
const insert = require('./insert');
const update = require('./update');
const remove = require('./remove');
const select = require('./select');
const Query  = require('./query');

module.exports = (table, schema) => {

  return class MygooseModel {
    /**
    * MygooseModel Constructor
    *
    * @param {Object} modelObject
    */
    constructor(modelObject) {
      this.id = null;
      this.prototype.schema = schema;
      this.prototype.table = table;

      this.prototype._setValues = (values) => {
        for(let field in values) {
          this[field] = values[field];
        }
      };

      // assign pre hooks
      if(!!this.prototype.schema.pre.init) {
        const val = this.prototype.schema.pre.init(this);
        for (let field in val) {
          this[field] = val[field];
        }
      }

      for(let field in modelObject) {
        this[field] = modelObject[field];
      }

      // assign  post hooks
      if(!!this.prototype.schema.post.init) {
        const val = this.prototype.schema.post.init(this);
        for (let field in val) {
          this[field] = val[field];
        }
      }
    }

    static find() {

    }

    static findOne() {

    }

    static findById(id, callback) {
      if(!callback){
        return select(this.prototype.table, this, {
          where: [
            this.prototype.table + '.id = ' + id
          ]
        });
      }
      else {
        select(this.prototype.table, this, {
          where: [
            this.prototype.table + '.id = ' + id
          ]
        }).then(values => {
          callback(null, values);
        }).catch(err => {
          callback(err);
        });
      }
    }

    static findByIdAndUpdate(id, newObject, callback) {
      
    }

    static findByIdAndRemove() {

    }

    save(callback) {
      new Promise((resolve, reject) => {
        // If has pre hook, exec the callback first
        if(!!this.prototype.schema.pre.save) {
          this.prototype.schema.pre.save(resolve);
        }
        // Or resolve
        resolve();
      }).then(() => {
        // If callback exists
        if(!!callback) {
          // Insert Case
          if (!this.id) {
            insert(this.prototype.table, this).then(values => {
              this.prototype._setValues(values);

              // If there is a hook after save
              if (!!this.prototype.schema.post.save) {
                this.prototype.schema.post.save(this);
              }
              callback(null, this);

            }).catch(err => {
              callback(err);
            });
          }
          // Update Case
          else {
            update(this.prototype.table, this).then(values => {
              this.prototype._setValues(values);

              // If there is a hook after save
              if (!!this.prototype.schema.post.save) {
                this.prototype.schema.post.save(this);
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
        if(!!this.prototype.schema.pre.remove)
          this.prototype.schema.pre.remove(resolve);

        // Or resolve
        resolve();
      }).then(() => {
        remove(this.prototype.table, this.id).then(values => {
          this.prototype._setValues(values);
          if (!!this.prototype.schema.post.save) {
            this.prototype.schema.post.save(this);
          }
          callback(null, this);
        }).catch(err => {
          callback(err);
        });
      });
    }
  };

};
