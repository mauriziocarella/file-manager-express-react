const express = require('express');
const router = express.Router();

const {File} = require('../../../db');
const middleware = require('../../middleware');

router.use(middleware.role());

router.get('/', async function (req, res, next) {
	const count = await File.countDocuments()
    const size = await File.aggregate([
		{
			$group: {
				_id: null,
				size: {
					$sum: "$size"
				}
			}
		}
	])
		.then((result) => Array.isArray(result) && result.length > 0 ? result[0].size : 0)

	const latest = await File.findOne()
		.sort('-createdAt')

	const files = await File.find()
		.sort('-createdAt')
		.limit(10)

	res.json({
		count,
		size,
		latest,
		files,
	})
});

module.exports = router;
