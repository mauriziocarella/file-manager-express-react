const express = require('express');
const jwt = require('jsonwebtoken');

const {User} = require('../../../db');
const config = require('../../../config');
const router = express.Router();

router.get('/', async function (req, res, next) {
    const user = req.user;

    if (!user) return next(404);

    res.json(user);
});
router.post('/register', async function (req, res, next) {
	const {email, password} = req.body;

	if (await User.findOne({email})) return next('User already registered');

    const user = await User.create({
		email,
		password,
	});

	res.json(user);
});
router.post('/login', async function (req, res, next) {
    const user = await User.findOne({
		email: req.body.email,
	});

	if (!user) return next([404, 'User not found']);
	if (!await user.comparePassword(req.body.password)) return next([404, 'User not found']);

	const token = jwt.sign(user.id, config.secret);

	res.cookie('token', token);

	res.json(user);
});
router.post('/logout', async function (req, res, next) {
	res.clearCookie('token');

    res.json();
});

module.exports = router;
