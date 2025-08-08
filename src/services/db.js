require('dotenv').config(); // Read .env file and set environment variable

const mysql = require('mysql2');

const setting = {
    connectionLimit : 10, //set limit to 10 connection
    host     : process.env.DB_HOST, //localhost', //'WRITE YOUR HOST HERE',
    user     : process.env.DB_USER, //'root', //'WRITE YOUR USER HERE',
    password : process.env.DB_PASSWORD, //'password', //'WRITE YOUR PASSWORD HERE',
    database : process.env.DB_DATABASE, //'pokemon', //'WRITE YOUR DATABASE HERE',
    multipleStatements: true, //allow multiple sql statements
    dateStrings: true //return date as string instead of Date object
}

const pool = mysql.createPool(setting);

module.exports = pool;
