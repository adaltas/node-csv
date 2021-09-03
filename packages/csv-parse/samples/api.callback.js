
import assert from 'assert'
import parse from '../lib/index.js'

const input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"'
parse(input, {
  comment: '#'
}, function(err, output){
  assert.deepStrictEqual(
    output,
    [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]
  )
})
