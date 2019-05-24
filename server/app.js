var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const db = require("./db");
const pg = require('pg-promise');
const QueryFile = pg.QueryFile;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

function sql(file) {
    const fullpath = path.join('../scripts/',file);
    return QueryFile(fullpath);
}

async function makeTables() {
    try {
        await db.none(sql('makeTables.sql'),{id:123});
    } catch (err) {
        console.log(err);
    }
}


module.exports = app;
