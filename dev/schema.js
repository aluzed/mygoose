/**
* Mysql Schema
*
* Mysql Schema Class
*
* Copyright(c) 2017 Alexandre PENOMBRE
* <aluzed_AT_gmail.com>
*/
const insert = require('./queries/insert');
const update = require('./queries/update');
const remove = require('./queries/remove');

module.exports = class MygooseSchema {
    /**
     * MygooseSchema Constructor
     *
     * @param {Object} schema
     */
    constructor(schema) {
        this.paths = {}
        this.hooks = {
            pre: {
                save: null,
                init: null,
                remove: null
            },
            post: {
                save: null,
                init: null,
                remove: null
            }
        }
        for(let field in schema) {
            this.paths[field] = schema[field];
        }
    }

    pre(hookType, callback) {
        if(hookType !== "save" && hookType !== "init" && hookType !== "remove")
            throw new Error('Unknown hook ' + hookType + ' for schema');

        this.hooks.pre[hookType] = callback;
    }

    post(hookType, callback) {
        if(hookType !== "save" && hookType !== "init" && hookType !== "remove")
            throw new Error('Unknown hook ' + hookType + ' for schema');

        this.hooks.post[hookType] = callback;
    }
}
