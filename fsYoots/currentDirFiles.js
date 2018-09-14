var fs = require('fs')
module.exports = dir => {
  return fs
    .readdirSync(dir)
    .filter(file => !fs.lstatSync(`${dir}/${file}`).isDirectory())
}
