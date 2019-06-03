var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const db = require("./db");
const pg = require('pg-promise');
const QueryFile = pg.QueryFile;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactsRouter = require('./routes/contacts');

var app = express();

setUp()
.then(makeTables)
.then((res) => {
    loadRouter();
    console.log("All additions successful");
})
.catch((err) => {
    console.log(err);
});


function setUp() {
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    return Promise.resolve();
}

function loadRouter() {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/contacts', contactsRouter);
    return Promise.resolve();
}

function sql(file) {
    const fullpath = path.join('../scripts/',file);
    return QueryFile(fullpath);
}

async function makeTables() {
    try {
        await db.none(sql('makeTables.sql'),{id:123});
        await db.none(sql('populateDB.sql'),{id:123});
    } catch (err) {
        throw err;
    }
}

module.exports = app;
