const express = require('express');
const path = require("path");
const router = express.Router();
const passport = require('passport');

const config = require('../config');

router.use((req, res, next) => passport.authenticate('jwt', function (err, user) {
    if (err) return next(err);

    if (user) {
        req.user = user;
    }

    next()
})(req, res, next));

router.use('/api', require('./api'));
router.use('/media/thumbnails', express.static(config.thumbnails.path, {
    maxAge: 60 * 1000 * 60 * 24 * 365,
}))

router.use(express.static(path.join(__dirname, '../www/build/')))
router.use('*', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../www/build/index.html'));
});

module.exports = router;
