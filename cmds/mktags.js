const fsY = require('../fsYoots')
const fs = require('fs')
const path = require('path')
const rndStr = require('../utils/randomString')

module.exports = args => {
  // variables
  let description = args.d
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
        // do nothing if file already contains tag
        if (sample.includes(fullTagName)) return

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
        if (processType === 'random') {
          nxtName = fullTagName
          // add random tag
          nxtName = (() => {
            let rnd = rndStr()
            // the odd chance the key already exists
            while (samples.find(sample => sample.includes(rnd))) {
              rnd = rndStr()
            }
            return `${nxtName} - ${rnd}`
          })()
        } else if (processType === 'named') {
          nxtName = name.replace(/\s_-_\s.*/, '')
          nxtName = `${nxtName} _-_ ${fullTagName}`
        }

        // add the ext back on
        nxtName += ext
        console.log(`Renaming: ${sample} >> ${nxtName}`)
        fs.renameSync(`${curDir}/${sample}`, `${curDir}/${nxtName}`)
      })
    }

    console.log(`Processing ${curDir}\n`)
    if (code === '&$') {
      processSamples('named')
    } else if (code === '&&') {
      processSamples('random')
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
