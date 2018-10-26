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
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'z',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '9',
  '0',
  '!',
  '#',
  '$',
  '&',
  '?',
]

const random = () => chars[Math.trunc(Math.random() * 66)]

exports.create = () => ['r', 'a', 'n'].map(random).join('')

exports.shiftForward = str => {
  const strArr = str.split('')
  return strArr
    .slice(strArr.length - 1)
    .concat(strArr.slice(0, strArr.length - 1))
    .join('')
}

exports.shiftBack = str => {
  const strArr = str.split('')
  return strArr
    .slice(1)
    .concat([strArr[0]])
    .join('')
}
