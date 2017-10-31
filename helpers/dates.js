/**
* Date Helpers
*
* Copyright(c) 2017 Alexandre PENOMBRE
* <aluzed_AT_gmail.com>
*/
module.exports = {
    /**
     * toDateSQL 
     * 
     * Converts a date to mysql date string format
     * 
     * @param {Date} date
     * @return {String} date to mysql format
     */
    toDateSQL: (date) => {
        if(typeof date === "undefined")
            throw new Error('Error, cannot convert an undefined value to date');

        let d = new Date(date);

        let day   = d.getDate();
        let month = d.getMonth() + 1;
        let year  = d.getFullYear();

        return `${year}-${month}-${day}`;
    },
    /**
     * toDatetimeSQL 
     * 
     * Converts a date to mysql datetime string format
     * 
     * @param {Date} date
     * @return {String} date to mysql format
     */
    toDatetimeSQL: (date) => {
        if (typeof date === "undefined")
            throw new Error('Error, cannot convert an undefined value to datetime');

        let d = new Date(date);

        let day   = d.getDate();
        let month = d.getMonth() + 1;
        let year  = d.getFullYear();
        let hour  = d.getHours();
        let min   = d.getMinutes();
        let sec   = d.getSeconds();

        return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    }
}