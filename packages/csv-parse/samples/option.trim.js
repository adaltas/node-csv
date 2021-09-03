
import assert from 'assert'
import parse from '../lib/index.js'

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
