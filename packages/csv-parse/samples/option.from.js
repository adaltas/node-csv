
import assert from 'assert'
import parse from '../lib/index.js'

parse(`
a,b|1,2|3,4
`.trim(), {
  columns: true,
  record_delimiter: '|',
  from: 2
}, function(err, records){
  assert.deepStrictEqual(
    records, [{
      a: '3',
      b: '4'
    }]
  )
})
