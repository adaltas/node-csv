
const parse = require('../lib/sync')
const assert = require('assert')

const records = parse('a ,1\nb, 2\n c,3', {
  trim: true
})
assert.deepStrictEqual(
  records, [
    [ 'a', '1' ],
    [ 'b', '2' ],
    [ 'c', '3' ]
  ]
)
