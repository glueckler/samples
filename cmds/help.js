/* eslint-disable no-console */
module.exports = args => {
  console.log(`This is the help menu..\n`)
  console.log(
    `--128 will create a folder (named: "magic128") with 128 random samples in whichever directory you're in\n`
  )
  console.log(
    `--tags will tag files based on the directory they are in for searching withing ableton
    dir name:
      use "&&Riser" for a directory listing samples named sRiser 1, sRiser 2 ... etc..
      use "&$Riser" to maintain the original filename and add the tag - sRiser

    -d tag takes one string and adds that to the end of every file processed    
`
  )
}
