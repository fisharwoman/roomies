const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const db = require('../../db');
const express = require('express');
const router = express.Router();
const path = require('path');

passport.use(new LocalStrategy({passReqToCallback: false},
    async function(username, password, done) {
        try {
            const query = `SELECT userid as username FROM Roommates WHERE email = '${username}' AND password = '${password}'`;
            let user = await db.oneOrNone(query);
            if (!user || user.length === 0) return done(null,false);
            else return done(null,user);
        } catch (e) {
            return done(e)
        }
    }
));
passport.serializeUser(function(user,done) {
    done(null, user.username);
});
passport.deserializeUser(function(user,done) {
    done(null, user);
});

exports.isAuthenticated = function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    else res.status(401).send("Please login first");
};

router
    .post('/login', passport.authenticate('local', {
        failureRedirect: '/failed',
        successRedirect: '/success'}))
    .get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '../../public', 'login.html'));
    })
    .get('/logout', (req, res) => {
        req.logout();
        res.status(200).send("Logout successful");
    });

exports.authenticate = router;

