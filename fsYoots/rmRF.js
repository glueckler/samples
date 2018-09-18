var fs = require('fs')

var deleteFolderRecursive = function (path) {
  if (path === '/') {
    console.log('lets not delete our computer..')
    return
  }
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

module.exports = deleteFolderRecursive
