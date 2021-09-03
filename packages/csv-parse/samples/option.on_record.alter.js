
import assert from 'assert'
import parse from '../lib/index.js'

parse(`
a.1,a.2,a.3
b.1,b.2,b.3
`.trim(), {
  on_record: (record, {lines}) =>
    [lines, record[2], record[0]]
}, function(err, records){
  assert.deepStrictEqual(
    records, [
      [1, 'a.3', 'a.1'],
      [2, 'b.3', 'b.1']
    ]
  )
})
