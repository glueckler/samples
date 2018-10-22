const minimist = require('minimist')
const prompt = require('./utils/promptUser')

module.exports = () => {
  console.log(`\nsamplesssSSsSSSS ...\n`)

  const args = minimist(process.argv.slice(2))
  let cmd = args._[0] || 'help'

  if (args.help || args.h) {
    cmd = 'help'
  } else if (args['128']) {
    cmd = '128'
  } else if (args['tags']) {
    cmd = 'tags'
  }

  switch (cmd) {
    case '128':
      require('./cmds/mk128')(args)
      break
    case 'tags':
      // if description is null ask if user would like to add one
      if (!args.d) {
        prompt(
          'Would you like to add a description tag for this batch?\nNevermind !! Just Hit Enter, this doesnt work ATM..',
          function(input) {
            args.d = input
            require('./cmds/mktags')(args)
            process.exit()
          }
        )
      } else {
        require('./cmds/mktags')(args)
      }
      break
    case 'help':
      require('./cmds/help')(args)
      break
    default:
      console.error(`"${cmd}" is not a valid command!`)
      break
  }
}
