const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const {ExtractJwt, Strategy: JwtStrategy} = require('passport-jwt');

const config = require('./config');
const {User} = require('./db');

passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromExtractors([
		(req) => {
			let token = null;
			if (req && req.cookies) {
				token = req.cookies.token;
			}
			return token;
		}
	]),
	secretOrKey: config.secret,
}, function(payload, done) {
	User.findById(payload, function(err, user) {
		if (err) return done(err);

		if (user) {
			return done(null, user);
		}

		return done(null, false);
	});
}));

const app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', require('./routes'));

module.exports = app;
