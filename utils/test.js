const rndString = require('./randomString')

const str = rndString.create()

console.log(str)
const sf = rndString.shiftForward(str)
console.log(sf)

const sb = rndString.shiftBack(sf)
console.log(sb)

