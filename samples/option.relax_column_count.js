
const parse = require('../lib')
const assert = require('assert')

parse(`
"a 1","a 2"
"b 1"
"c 1","c 2","c 3"
`.trim(), {
  relax_column_count: true
}, function(err, records){
  assert.deepEqual(
    records, [
      ['a 1', 'a 2'],
      ['b 1'],
      ['c 1', 'c 2', 'c 3']
    ]
  )
})
