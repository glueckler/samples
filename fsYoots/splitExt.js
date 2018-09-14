var path = require('path')
module.exports = file => {
  var ext = path.extname(file)
  ext = ext || ''
  return [file.substring(0, file.lastIndexOf(ext || '')), ext]
}
