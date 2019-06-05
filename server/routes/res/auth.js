const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const db = require('../../db');

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
    else res.send("You need to login first");
};