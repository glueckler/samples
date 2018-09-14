var path = require('path')
// remember the dot
// path.extname('something.wav') --> .wav
module.exports = (ext, file) => path.extname(file) === ext
