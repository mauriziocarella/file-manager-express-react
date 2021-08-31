require('dotenv').config()

const path = require('path');

const config = {
    port: +process.env.PORT || 3001,
    secret: process.env.APP_SECRET,
    db: {
        username: 'filemanager',
        password: 'filemanager',
        host: process.env.MONGO_HOST || 'localhost',
        port: +process.env.MONGO_PORT || 27017,
    },
    content: {
        // path: '\\\\RASPBERRYPI\\maurizio',
        path: '\\\\raspberrypi.local\\system\\Video',
        extensions: ['mp4', 'mkv']
    },
    thumbnails: {
        path: path.join(__dirname, '../content/thumbnails')
    }
}

module.exports = config
