
import assert from 'assert'
import parse from '../lib/index.js'

const data = 'a key => a value'
const records = parse(data, {
  delimiter: "=>",
  trim: true
})
assert.deepStrictEqual(records, [
  [ "a key", "a value" ]
])
