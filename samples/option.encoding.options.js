
const parse = require('../lib/sync')
const assert = require('assert')

const data = Buffer.from(`a:b\n1:2`, 'utf16le')
const records = parse(data, {
  encoding: 'utf16le',
  delimiter: Buffer.from(':', 'utf16le')
})
assert.deepStrictEqual(records, [
  ['a', 'b'],
  ['1', '2']
])
