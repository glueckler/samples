const fsY = require('../fsYoots')
const fs = require('fs')
const rndStr = require('../utils/randomString')

module.exports = args => {
  // variables
  let description = args.d
  const rootDir = fsY.currentDir()
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

  const mainOperation = curDir => {
    const contents = fs.readdirSync(curDir)

    // loop through the current directory and process each directory one at a time
    contents.forEach(fileName => {
      const filePath = `${curDir}/${fileName}`

      // check if is a directory..
      if (!fsY.isDir(filePath)) {
        console.log(`"${fileName}" is not a directory.. skip..\n`)
        return
      }

      // get code and tagname
      const code = fileName.substring(0, 2)
      const tagName = fileName.substring(2)

      if (fileName === 'stags') {
        console.log(`"stags" ... skip`)
        return
      }

      //
      //
      // create function for &$ directory..
      const processNamedFileDir = () => {
        const samples = fsY.currentDirFiles(filePath)
        // loop through all samples
        samples.forEach(sample => {
          // do nothing if file already contains tag
          if (sample.includes(`s${tagName}`)) return

          // delete file if it's .asd
          if (fsY.hasExt('.asd', sample)) {
            console.log(`Deleting: ${sample}`)
            fs.unlinkSync(`${filePath}/${sample}`)
            // and return
            return
          }
          // split off the extension
          const [name, ext] = fsY.splitExt(sample)

          let nxtName = `${name} - s${tagName}`
          if (description) {
            nxtName = `${nxtName} - ${description}`
          }

          // add the ext back on
          nxtName += ext
          console.log(`Renaming: ${sample} >> ${nxtName}`)
          fs.renameSync(`${filePath}/${sample}`, `${filePath}/${nxtName}`)
        })
      }

      //
      //
      // create function for && directory..
      const processListFileDir = () => {
        const samples = fsY.currentDirFiles(filePath)
        // loop through all samples
        samples.forEach(sample => {
          // do nothing if file already contains tag
          if (sample.startsWith(`s${tagName}`)) return

          // delete file if it's .asd
          if (fsY.hasExt('.asd', sample)) {
            console.log(`Deleting: ${sample}`)
            fs.unlinkSync(`${filePath}/${sample}`)
            // and return
            return
          }
          // split off the extension
          const [_name, ext] = fsY.splitExt(sample)

          let nxtName = `s${tagName}`
          if (description) {
            nxtName = `${nxtName} - ${description}`
          }
          // add random tag
          nxtName = (() => {
            let rnd = rndStr()
            // the odd chance the key already exists
            while (samples.find(sample => sample.includes(rnd))) {
              rnd = rndStr()
            }
            return `${nxtName} - ${rnd}`
          })()

          // add the ext back on
          nxtName += ext
          console.log(`Renaming: ${sample} >> ${nxtName}`)
          fs.renameSync(`${filePath}/${sample}`, `${filePath}/${nxtName}`)
        })
      }

      console.log(`Processing ${fileName}\n`)
      if (code === '&$') {
        processNamedFileDir()
        writeTagFile(tagName)
      } else if (code === '&&') {
        processListFileDir()
        writeTagFile(tagName)
      } else {
        // if the directory doesn't match either above dive into it!
        console.log(`Diving one layer deeper into >> ${filePath}\n`)
        mainOperation(filePath)
      }
    })
  }

  mainOperation(rootDir)
}
