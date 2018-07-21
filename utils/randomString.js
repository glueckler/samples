// function to generate random string
var chars = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
]

const random = () => chars[Math.trunc(Math.random() * 16)]

module.exports = () => ['r', 'a', 'n', 'd', 'o', 'm'].map(random).join('')
