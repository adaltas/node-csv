
import assert from 'assert'
import parse from '../lib/index.js'

const records = parse(`
a,1
b,1
x,x
`.trim(), {
  to_line: 2
})
assert.deepStrictEqual(
  records, [
    [ 'a', '1' ],
    [ 'b', '1' ]
  ]
)
