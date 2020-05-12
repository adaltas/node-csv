
const parse = require('../lib/sync')
const assert = require('assert')

const data = 'a key => a value'
const records = parse(data, {
  delimiter: "=>",
  trim: true
})
assert.deepEqual(records, [
  [ "a key", "a value" ]
])
