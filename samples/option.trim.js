
const parse = require('../lib/sync')
const assert = require('assert')

const records = parse(`
a ,1
b, 2
 c,3
`.trim(), {
  trim: true
})
assert.deepEqual(
  records, [
    [ 'a', '1' ],
    [ 'b', '2' ],
    [ 'c', '3' ]
  ]
)
