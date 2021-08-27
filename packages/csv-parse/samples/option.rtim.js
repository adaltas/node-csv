
const parse = require('../lib/sync')
const assert = require('assert')

const data = [
  'a ,1',
  'b, 2 ',
  ' c,3'
].join('\n')
const records = parse(data, {
  rtrim: true
})
assert.deepStrictEqual(
  records, [
    [ 'a', '1' ],
    [ 'b', ' 2' ],
    [ ' c', '3' ]
  ]
)
