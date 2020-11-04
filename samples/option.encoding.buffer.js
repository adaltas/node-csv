
const parse = require('../lib/sync')
const assert = require('assert')

const data = Buffer.from(`a,b\n1,2`)
const records = parse(data, {
  encoding: null
})
assert.deepEqual(records, [
  [ Buffer.from('a'), Buffer.from('b') ],
  [ Buffer.from('1'), Buffer.from('2') ]
])
