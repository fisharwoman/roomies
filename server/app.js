var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const db = require("./db");
const pg = require('pg-promise');
const QueryFile = pg.QueryFile;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const contactsRouter = require('./routes/contacts');
const householdsRouter = require('./routes/households');
const bulletinsRouter = require('./routes/bulletins');
const calendarRouter = require('./routes/calendar-entries');
const expensesRouter = require('./routes/expenses');

const app = express();

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
    app.use('/households', householdsRouter);
    app.use('/bulletins', bulletinsRouter);
    app.use('/calendar-entries', calendarRouter);
    app.use('/expenses', expensesRouter);
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
        await db.none(sql('makeViews.sql'),{id:123});
    } catch (err) {
        throw err;
    }
}

module.exports = app;
