
const transform = require('../lib/sync')
const assert = require('assert')

const data = transform([
  [ 'a', 'b', 'c', 'd' ],
  [ '1', '2', '3', '4' ]
], function(data){
  data.push(data.shift())
  return data
})
assert.deepEqual(data, [
  [ 'b', 'c', 'd', 'a' ],
  [ '2', '3', '4', '1' ]
])
