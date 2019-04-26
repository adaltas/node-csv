
const transform = require('../lib/sync')
const assert = require('assert')

const records = transform([
  [ 'a', 'b', 'c', 'd' ],
  [ '1', '2', '3', '4' ]
], function(record){
  record.push(record.shift())
  return record
})

assert.deepEqual(records, [
  [ 'b', 'c', 'd', 'a' ],
  [ '2', '3', '4', '1' ]
])
