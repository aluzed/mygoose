/**
* Mysql Schema
*
* Mysql Schema Class
*
* Copyright(c) 2017 Alexandre PENOMBRE
* <aluzed_AT_gmail.com>
*/
const insert = require('./insert');
const update = require('./update');
const remove = require('./remove');

module.exports = class MygooseSchema {
    /**
     * MygooseSchema Constructor
     * 
     * @param {Object} schema
     */
    constructor(schema) {
        this.paths = {}
        for(let field in schema) {
            this.paths[field] = schema[field];
        }
        this.pre = {
            save: null,
            init: null,
            remove: null
        }
        this.post = {
            save: null,
            init: null,
            remove: null
        }
    }

    pre(hookType, callback) {
        if(hookType !== "save" && hookType !== "init" && hookType !== "remove")
            throw new Error('Unknown hook ' + hookType + ' for schema');
        
        this.pre[hookType] = callback;
    }

    post(hookType, callback) {
        if(hookType !== "save" && hookType !== "init" && hookType !== "remove")
            throw new Error('Unknown hook ' + hookType + ' for schema');
        
        this.post[hookType] = callback;
    }
}