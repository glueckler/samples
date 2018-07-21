const minimist = require('minimist')
const R = require('ramda')

module.exports = () => {
  const args = minimist(process.argv.slice(2))
  let cmd = args._[0] || 'help'

  if (args.help || args.h) {
    cmd = 'help'
  }

  if (args['128']) {
    cmd = '128'
  }

  switch (cmd) {
    case '128':
      require('./cmds/mk128')(args)
      break
    case 'help':
      require('./cmds/help')(args)
      break
    default:
      console.error(`"${cmd}" is not a valid command!`)
      break
  }
}
