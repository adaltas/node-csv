
const parse = require('../lib/sync')
const assert = require('assert')

const data = Buffer.from(`\uFEFFa,b,c\n1,2,3`, 'utf16le')
const records = parse(data, {
  bom: true
})
assert.deepEqual(records, [
  [ 'a', 'b', 'c' ],
  [ '1', '2', '3' ]
])
