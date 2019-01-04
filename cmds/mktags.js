require('../utils/randomizeArray') // mad side effects
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
    const processSamples = () => {
      // loop through all samples
      // use a count because index will not count consistently
      let count = 0
      samples.randomize().forEach((sample) => {
        let fullTagName = currentTags.length ? ` _-_ s${currentTags.join(' - s')}` : ''

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

        // delete the tags
        nxtName = name.replace(/\s_-_\s.*/, '').replace(/^.*->\s/, '')

        nxtName = `${nxtName}${fullTagName}`

        // so if we use && then the index will be in name, making it random
        if (code === '&&') {
          nxtName = `${count}-> ${nxtName}`
          count++
        }

        // add the ext back on
        nxtName += ext
        console.log(`Renaming: ${sample} >> ${nxtName}`)
        fs.renameSync(`${curDir}/${sample}`, `${curDir}/${nxtName}`)
      })
    }

    console.log(`Processing ${curDir}\n`)
    if (!rootDir) {
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
