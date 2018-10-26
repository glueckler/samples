const fsY = require('../fsYoots')
const fs = require('fs')
const path = require('path')
const rndStr = require('../utils/randomString')

module.exports = args => {
  // variables
  let description = args.d
  const shiftTags = args.s
  const unshiftTags = args.u
  const rootDir = fsY.currentDir()
  const baseName = path.basename(rootDir)
  const stagsPath = `${rootDir}/stags`

  // may as well just delete the stags dir and start fresh
  if (fs.existsSync(stagsPath)) {
    fsY.rmRF(stagsPath)
  }
  fs.mkdirSync(stagsPath)

  const writeTagFile = tagName => {
    const tagPath = `${stagsPath}/s${tagName}.wav`
    var fd = fs.openSync(tagPath, 'w')
    fs.writeFileSync(tagPath, 'i love you.')
    fs.closeSync(fd)
  }

  // recursively called on directories
  const mainOperation = ({ curDir, dirName, rootDir }, tags = []) => {
    const contents = fs.readdirSync(curDir).filter(file => file[0] !== '.')
    const code = dirName.substring(0, 2)
    const tagName = dirName.substring(2)
    const currentTags = [...tags]
    const samples = contents.filter(
      fileOrDir => !fsY.isDir(`${curDir}/${fileOrDir}`)
    )
    const dirs = contents.filter(fileOrDir =>
      fsY.isDir(`${curDir}/${fileOrDir}`)
    )

    if ((code === '&&' || code === '&$') && !rootDir) {
      currentTags.push(tagName)
      writeTagFile(tagName)
    }

    //
    //
    // create function for &$ directory..
    const processSamples = processType => {
      // loop through all samples
      samples.forEach(sample => {
        let fullTagName = `s${currentTags.join(' - s')}`
        // attempt to find the random string
        const rndRgEx = /^.{3}->\s/
        let rndTag = sample.search(rndRgEx)

        const shouldNotChangeRndTag = rndTag !== -1 && !shiftTags && !unshiftTags
        // do nothing if file already contains tags
        if (
          sample.includes(fullTagName) &&
          (code === '&&' && shouldNotChangeRndTag)
        ) {
          return
        }

        // delete file if it's .asd
        if (fsY.hasExt('.asd', sample)) {
          console.log(`Deleting: ${sample}`)
          fs.unlinkSync(`${curDir}/${sample}`)
          // and return
          return
        }

        let nxtName
        // split off the extension
        const [name, ext] = fsY.splitExt(sample)
        let newRndTag
        // we already have a random tag and we are shift it
        if (rndTag !== -1 && (shiftTags || unshiftTags)) {
          const oldRndTag = name
            .split('')
            .slice(0, 3)
            .join('')
          if (shiftTags) {
            newRndTag = rndStr.shiftForward(oldRndTag)
          }
          if (unshiftTags) {
            newRndTag = rndStr.shiftBack(oldRndTag)
          }
        } else {
          newRndTag = rndStr.create()
        }

        // delete the tags
        nxtName = name.replace(/\s_-_\s.*/, '').replace(rndRgEx, '')

        nxtName = `${nxtName} _-_ ${fullTagName}`

        if (code === '&&') {
          nxtName = `${newRndTag}-> ${nxtName}`
        }

        // add the ext back on
        nxtName += ext
        console.log(`Renaming: ${sample} >> ${nxtName}`)
        fs.renameSync(`${curDir}/${sample}`, `${curDir}/${nxtName}`)
      })
    }

    console.log(`Processing ${curDir}\n`)
    if ((code === '&&' || code === '&$') && !rootDir) {
      processSamples()
    }

    // loop through the current directory and process each directory one at a time
    dirs.forEach(dirName => {
      const curPath = `${curDir}/${dirName}`

      if (dirName === 'stags') {
        console.log(`"stags" ... skip`)
        return
      }
      console.log(`Diving one layer deeper into >> ${curPath}\n`)
      mainOperation({ curDir: curPath, dirName: dirName }, currentTags)
    })
  }

  mainOperation({ curDir: rootDir, dirName: baseName, rootDir: true })
}
