
import assert from 'assert'
import parse from '../lib/index.js'

parse(`
x,x
a,b
1,2
`.trim(), {
  columns: true,
  from_line: 2
}, function(err, records){
  assert.deepStrictEqual(
    records, [{
      a: '1',
      b: '2'
    }]
  )
})
