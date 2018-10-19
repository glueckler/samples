/* eslint-disable no-console */
module.exports = args => {
  console.log(`This is the help menu..\n`)
  console.log(
    `--128 will create a folder (named: "magic128") with 128 random samples in whichever directory you're in\n`
  )
  console.log(
    `--tags will tag files based on the directory they are in for searching within ableton
    dir name:
      &&<name> \tex: "&&Riser" use for a (random) directory
      &$<name> \tex: "&$Riser" use to maintain the original filename and add the tag - sRiser

    -d tag takes one string and adds that to the end of every file processed 
      ex: samples --tags -d patches   
`
  )
}
