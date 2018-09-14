var fs = require('fs')
module.exports = file => fs.lstatSync(file).isDirectory()
