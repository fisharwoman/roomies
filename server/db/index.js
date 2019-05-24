const initOptions = {};
const pgp = require('pg-promise')();

const cn = {
    database: 'postgres',
    user: 'postgres'    
}

const db = pgp(cn);

module.exports = db;