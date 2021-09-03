
import assert from 'assert'
import parse from '../lib/index.js'

const data = Buffer.from(`a,b\n1,2`)
const records = parse(data, {
  encoding: null
})
assert.deepStrictEqual(records, [
  [ Buffer.from('a'), Buffer.from('b') ],
  [ Buffer.from('1'), Buffer.from('2') ]
])
