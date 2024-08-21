// src/config/db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'D#FR$GG#D',
    database: 'inua_crm'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});

module.exports = connection;
