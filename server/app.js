const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const pass = require('./routes/res/auth');

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
const signupRouter = require('./routes/signup');
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
    app.use(session({secret: '123'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(require('body-parser').json());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    return Promise.resolve();
}

function loadRouter() {
    app.use('/', indexRouter);
    app.use('/auth', pass.authenticate);
    app.use('/signup', signupRouter);
    app.use('/users', pass.isAuthenticated, usersRouter);
    app.use('/contacts', pass.isAuthenticated, contactsRouter);
    app.use('/households', householdsRouter); // TODO add authentication
    app.use('/bulletins', pass.isAuthenticated, bulletinsRouter);
    app.use('/calendar-entries', pass.isAuthenticated, calendarRouter);
    app.use('/expenses', pass.isAuthenticated, expensesRouter);
    return Promise.resolve();
}

app.get('/logout', (req,res) =>{
    req.logout();
    res.redirect('/success');
});
app.get('/checkLogin', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/success');
    } else {
        res.redirect('/failed');
    }
});
app.get('/failed', (req, res) => {
    res.status(200).send('Failed');
});
app.get('/success', (req,res) => {
    res.status(200).send('Success');
});

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
