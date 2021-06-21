
const parse = require('../lib/sync')
const assert = require('assert')

const data = "\ufeffa,b,c\n"
const records = parse(data, {
  bom: true
})
assert.deepStrictEqual(records, [
  [ 'a', 'b', 'c' ]
])
