const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const async = require('async');

const {File, User} = require('../../../db');
const config = require('../../../config');

const middleware = require('../../middleware');
const Media = require('../../../utils/media');

router.use(middleware.role());

router.get('/', async function (req, res, next) {
	const user = req.user;

	let perPage = req.query.perPage || 10;
	let page = req.query.page || 1;
	let offset = (page-1)*perPage;
	let sort = {
		key: 'createdAt',
		dir: 'desc',
	}

	if (req.query.sortKey) sort.key = req.query.sortKey;
	if (req.query.sortDir) sort.dir = req.query.sortDir;

	const $or = [];
	const $and = [];
	if (req.query.search) {
		$or.push({
			label: {$regex: req.query.search, $options: 'i'}
		})
		$or.push({
			filename: {$regex: req.query.search, $options: 'i'}
		})
		$or.push({
			tags: {$regex: req.query.search, $options: 'i'}
		})
	}
	switch (req.query.filter) {
		case 'favorites': {
			$and.push({
				_id: {
					$in: user.favorites,
				}
			})
			break;
		}
	}

	const query = {}
	if ($or.length > 0) query.$or = $or;
	if ($and.length > 0) query.$and = $and;

	const files = await File.find(query)
		.skip(offset)
		.limit(perPage)
		.sort(`${sort.dir === 'desc' ? '-' : ''}${sort.key}`)

	const count = await File.countDocuments($or.length === 0 ? {} : {
		$or: $or
	})

	res.json({
		files,
		pagination: {
			page,
			perPage,
			pages: Math.ceil(count/perPage),
		}
	});
});
router.get('/favorites', async function (req, res, next) {
	const user = req.user;

	const files = await File.find({
		_id: {
			$in: user.favorites,
		}
	});

	res.json(files);
});

router.use('/:id', async function (req, res, next) {
	const file = await File.findById(req.params.id);

	if (!file) return next(404);

	req.file = file;

	next();
});

router.get('/:id', async function (req, res, next) {
	const file = req.file;

	res.json(file);
});

router.post('/:id/favorite', async function (req, res, next) {
    const user = req.user;
    const file = req.file;

    if (user.favorites.includes(file._id)) {
		await User.findByIdAndUpdate(user.id, { $pull: { favorites: file.id } });
	}
    else {
		await User.findByIdAndUpdate(user.id, { $push: { favorites: file.id } });
	}

    res.json(await User.findById(user.id))
});

router.get('/:id/raw', async function (req, res, next) {
	const file = req.file;

	const filePath = path.join(config.content.path, file.path);

	if (['video/mp4'].includes(file.mimeType)) {
		const stat = fs.statSync(filePath);
		const fileSize = stat.size;
		const range = req.headers.range;

		if (range) {
			const parts = range.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
			const chunksize = (end - start) + 1;
			const file = fs.createReadStream(filePath, {start, end});
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': 'video/mp4',
			}
			res.writeHead(206, head);
			file.pipe(res);
		} else {
			const head = {
				'Content-Length': fileSize,
				'Content-Type': 'video/mp4',
			}
			res.writeHead(200, head)
			fs.createReadStream(filePath).pipe(res)
		}
	}
	else {
		next('unknown')
	}
});

router.post('/:id', async function (req, res, next) {
    const file = req.file;

    if (req.body.label) file.label = req.body.label;
    if (req.body.tags) file.tags = req.body.tags;

    res.json(await file.save())
});

module.exports = router;
