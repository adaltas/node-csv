const parse = require('../lib/sync')
const assert = require('assert')

const records = parse(`
a,1
b,1
x,x
`.trim(), {
  to_line: 2
})
assert.deepEqual(
  records, [
    [ 'a', '1' ],
    [ 'b', '1' ]
  ]
)
