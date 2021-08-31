const mongoose = require('mongoose');

const config = require('../config');

console.log('Connecting to', `mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}`)
mongoose.connect(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

module.exports = {
	File: require('./models/File'),
	User: require('./models/User'),
}
