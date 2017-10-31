/**
* Remove Data
*
* Remove data from our mysql database
*
* Copyright(c) 2017 Alexandre PENOMBRE
* <aluzed_AT_gmail.com>
*/
const Query = require('./query');

module.exports = (table, id) => {
    let query = new Query()
    query.init();

    return query.exec('DELETE FROM '+ table + ' WHERE id = ' + id + ';').then(result => {
        query.close();
        return result;
    });
}
