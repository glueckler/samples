/* eslint-disable no-console */
var fs = require('fs')
var path = require('path')
var deleteDir = require('../utils/deleteDir')

module.exports = args => {
  console.log(`\nsamplesssSSsSSSS ...\n`)
  console.log(`making random 128...\n`)
  deleteDir('./magic128')
  fs.mkdirSync('./magic128')

  var filesInDir = fs
    .readdirSync('./')
    .filter(file => path.extname(file) !== '.asd') // no ableton files allowed..

  // recursive function to return a file name and try again if it's not a file
  const findFileNotDir = () => {
    if (filesInDir.length === 0) return
    var randomIndex = Math.trunc(Math.random() * filesInDir.length)
    var file = filesInDir[randomIndex]
    filesInDir.splice(randomIndex, 1)
    if (fs.lstatSync(file).isDirectory() || file[0] === '.')
      return findFileNotDir()
    else return file
  }

  // create an Array with 128 slots, turn them into files,
  Array(128)
    .join(' ')
    .split(' ')
    .map(findFileNotDir)
    .filter(file => !!file) // if there are less than 128 files, some will be undefined..
    .forEach((file, i) => {
      fs.copyFileSync(file, `./magic128/${i} - ${file}`)
      console.log(`${file} was coppied to ./magic128/${file}`)
    })
  console.log(`\nfinished creating random 128 (see magic128 directory) :)\n`)
}
