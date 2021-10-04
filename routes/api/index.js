const express = require('express');
const router = express.Router();
const glob = require('glob-promise');
const async = require('async');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const config = require('../../config');

const {File} = require('../../db');
const Preview = require('../../utils/media');
const Media = require('../../utils/media');
const {User} = require('../../db');

router.use('/files', require('./files'));
router.use('/statistics', require('./statistics'));
router.use('/auth', require('./auth'));

router.get('/install', async function (req, res, next) {
	const {email, password} = req.query;

	if (!email || !password) return next('Invalid data');
	if (await User.findOne({email})) return next('User already registered');

	const user = await User.create({
		email,
		password,
	});

	res.json(user);
})

router.get('/scripts/thumbnails', async function (req, res, next) {
	const files = await File.find({
		thumbnail: { $exists: false }
	});

	await async.forEachSeries(files, async (file) => {
		let input = path.join(config.content.path, file.path);
		let output = path.join(config.thumbnails.path, `${file.id}.jpg`)

		try {
			const thumbnail = await Preview.thumbnail(input, output)
			file.thumbnail = `${file.id}.jpg`;
			await file.save()
		}
		catch (e) {
			console.error(e)
		}

		return output;
	})

	res.json(files)
});
router.get('/scripts/import', async function (req, res, next) {
	let extensions = [];
	if (typeof config.content.extensions === "object" && Array.isArray(config.content.extensions)) {
		extensions = config.content.extensions;
	}
	else if (typeof config.content.extensions === "string") {
		extensions = [config.content.extensions]
	}

	const filePaths = await glob(extensions.length === 0 ? `**/*` : `**/*.{${extensions.join(',')}}`, {
		cwd: config.content.path,
	})

	const files = await async.reduce(filePaths, [], async (arr, filePath) => {
		let file = await File.findOne({
			path: filePath,
		})

		if (!file) {
			arr.push(await File.createFromPath(filePath))
		}

		return arr;
	})

	res.json(files)
});
router.get('/scripts/metadata', async function (req, res, next) {
	let files = await File.find({
		metadata: { $exists: false }
	});

	files = await async.mapLimit(files, 10, async (file) => {
		try {
			file.metadata = await Media.metadata(file.fullPath());
			await file.save()
		}
		catch (e) {
			console.error(e)
		}

		return file;
	})

	res.json(files);
});

router.use(async function (req, res, next) {
	next(404);
});

router.use(async function (err, req, res, next) {
	const error = {
		code: 500,
		message: '',
	};

	if (typeof err === "number") {
		error.code = err;
	}
	else if (typeof err === "string") {
		error.message = err;
	}
	else if (typeof err === "object" && Array.isArray(err) && err.length === 2) {
		error.code = err[0];
		error.message = err[1];
	}
	else if (typeof err === "object") {
		if (err.code) error.code = err.code;
		if (err.message) error.message = err.message;
	}

	if (!error.message) {
		switch (error.code) {
			case 400: error.message = 'Bad request'; break;
			case 401: error.message = 'Unauthenticated'; break;
			case 403: error.message = 'Unauthorized'; break;
			case 404: error.message = 'Not found'; break;
			case 500: error.message = 'Internal server error'; break;
		}
	}

	res.status(error.code)
	res.json(error);
});

module.exports = router;
