const mongoose = require('mongoose');
const path = require('path');
const config = require('../../config');
const fs = require('fs');
const mime = require('mime-types');
const Media = require('../../utils/media');
const Preview = require('../../utils/media');

const FileSchema = new mongoose.Schema({
    label: String,
    filename: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    size: Number,
    tags: [String],
    mimeType: String,
    thumbnail: String,
    metadata: {}
}, {
    timestamps: true,
});

FileSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
FileSchema.virtual('fileType').get(function () {
    return Media.fileType(this.path);
})

FileSchema.statics.createFromPath = async function (filePath) {
    const fullPath = path.join(config.content.path, filePath);

    const stat = await fs.promises.stat(fullPath);
    const mimeType = mime.lookup(filePath);

    const metadata = await Media.metadata(fullPath);


    const file = await File.create({
        path: filePath,
        filename: path.basename(filePath, path.extname(filePath)),
        size: stat.size,
        mimeType: mimeType,
        createdAt: new Date(stat.ctimeMs),
        updatedAt: new Date(stat.mtimeMs),
        metadata,
    })

    try {
        await Preview.thumbnail(fullPath, path.join(config.thumbnails.path, `${file.id}.jpg`))

        file.thumbnail = `${file.id}.jpg`;
        await file.save();
    }
    catch (e) {}

    return file;
}
FileSchema.methods.fullPath = function() {
    const file = this;

    return path.join(config.content.path, file.path);
}

FileSchema.set('toJSON', {
    virtuals: true
});

const File = mongoose.model('File', FileSchema);

module.exports = File;
