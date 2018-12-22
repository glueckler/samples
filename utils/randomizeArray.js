const rndStr = require("./randomString");

Array.prototype.randomize = function() {
  return this
  .map(data => ({ data, randomKey: rndStr.create() }))
  .sort((nameA, nameB) => {
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  })
  .map(({ data }) => data)
}
