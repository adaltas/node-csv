
import assert from 'assert'
import parse from '../lib/index.js'

const data = Buffer.from(`\uFEFFa,b,c\n1,2,3`, 'utf16le')
const records = parse(data, {
  bom: true
})
assert.deepStrictEqual(records, [
  [ 'a', 'b', 'c' ],
  [ '1', '2', '3' ]
])
