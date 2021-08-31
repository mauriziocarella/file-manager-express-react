const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types')

const Media = {
	fileType: (input) => {
		let mimeType = mime.lookup(input);
		if (!mimeType) return 'other';

		let fileType = 'other';
		switch (mimeType.split('/')[0]) {
			case 'image': fileType = 'image'; break;
			case 'video': fileType = 'video'; break;
			case 'audio': fileType = 'audio'; break;
			default: fileType = 'other'; break;
		}

		return fileType;
	},
	duration: (input) => new Promise(async (resolve, reject) => {
		if (!fs.existsSync(input)) return reject("File doesn't exist please make sure you are using the right path");
		if (!fs.lstatSync(input).isFile()) return reject("Input file is not a valid file.")

		switch (Media.fileType(input)) {
			case 'video':
			case 'audio': {
				let args = ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', input];

				child_process.execFile('ffprobe', args, function (err, stdout, stderr) {
					if (err) return reject(err);

					try {
						const json = JSON.parse(stdout);

						return resolve(parseFloat(json.format.duration));
					}
					catch (e) {
						reject(e)
					}
				});
				break;
			}

			default: return reject("Unsupported file type");
		}
	}),
	thumbnail: (input, output, options = {}) => new Promise(async (resolve, reject) => {
		if (!fs.existsSync(input)) return reject("File doesn't exist please make sure you are using the right path");
		if (!fs.lstatSync(input).isFile()) return reject("Input file is not a valid file.")

		let inputExtension = path.extname(input).toLowerCase().replace('.', '');
		let outputExtension = path.extname(output).toLowerCase().replace('.', '');

		if (!['gif', 'jpg', 'jpeg', 'png'].includes(outputExtension)) return reject(`Output extension '${outputExtension}' is not supported, use png, gif, jpg`);

		switch (inputExtension === "pdf" ? "image" : Media.fileType(input)) {
			case 'video': {
				let args = ['-y', '-i', input, '-vf', 'thumbnail', '-frames:v', '1', output];
				if (options.width > 0 && options.height > 0) {
					args.splice(4, 1, `thumbnail,scale=${options.width}:${options.height}`);
				}

				child_process.execFile('ffmpeg', args, function (err) {
					if (err) return reject(err);

					resolve({thumbnail: output});
				});
				break;
			}

			case 'image': {
				//TODO
				// let convertArgs = [input + '[0]', output];
				// if (options.width > 0 && options.height > 0) {
				// 	if (options.keepAspect) {
				// 		convertArgs.splice(0, 0, '-resize', options.width + 'x' + options.height);
				// 	} else {
				// 		convertArgs.splice(0, 0, '-resize', options.width + 'x' + options.height + '!');
				// 	}
				// } else if (options.height > 0) {
				// 	convertArgs.splice(0, 0, '-resize', 'x' + options.height);
				// } else if (options.width > 0) {
				// 	convertArgs.splice(0, 0, '-resize', options.width);
				// }
				// if (options.quality) {
				// 	convertArgs.splice(0, 0, '-quality', options.quality);
				// }
				// if (options.background) {
				// 	convertArgs.splice(0, 0, '-background', options.background);
				// 	convertArgs.splice(0, 0, '-flatten');
				// }
				// child_process.execFile('convert', convertArgs, function (error) {
				// 	if (error) reject(error);
				// 	resolve({thumbnail: output});
				// });
				break;
			}

			case 'audio': {
				break;
			}

			case 'other': {
				//TODO
				// let tempPDF = path.join(options.pdf_path, fileNameOriginal + '.pdf');
				//
				// child_process.execFile('unoconv', ['-e', 'PageRange=1', '-o', tempPDF, input], function (error) {
				// 	if (error) reject(error);
				// 	let convertOtherArgs = [tempPDF + '[0]', output];
				// 	if (options.width > 0 && options.height > 0) {
				// 		if (options.keepAspect) {
				// 			convertOtherArgs.splice(0, 0, '-resize', options.width + 'x' + options.height);
				// 		} else {
				// 			convertOtherArgs.splice(0, 0, '-resize', options.width + 'x' + options.height + '!');
				// 		}
				// 	} else if (options.height > 0) {
				// 		convertOtherArgs.splice(0, 0, '-resize', 'x' + options.height);
				// 	} else if (options.width > 0) {
				// 		convertOtherArgs.splice(0, 0, '-resize', options.width);
				// 	}
				// 	if (options.quality) {
				// 		convertOtherArgs.splice(0, 0, '-quality', options.quality);
				// 	}
				// 	if (options.background) {
				// 		convertOtherArgs.splice(0, 0, '-background', options.background);
				// 		convertOtherArgs.splice(0, 0, '-flatten');
				// 	}
				// 	child_process.execFile('convert', convertOtherArgs, function (error) {
				// 		if (error) reject(error);
				// 		if (!options.pdf || options.pdf == undefined) {
				// 			fs.unlink(tempPDF, function (error) {
				// 				if (error) reject(error);
				// 				resolve({thumbnail: output});
				// 			});
				// 		} else {
				// 			resolve({thumbnail: output, pdf: tempPDF});
				// 		}
				// 	});
				// });
				break;
			}
		}
	}),
	metadata: (input) => new Promise(async (resolve, reject) => {
		const metadata = {};

		switch (Media.fileType(input)) {
			case 'video':
			case 'audio': {
				try {
					metadata.duration = await Media.duration(input);
				}
				catch (e) {}
				break;
			}
		}

		resolve(metadata)
	})
}

module.exports = Media;
