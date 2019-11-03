
const parse = require('../lib')
const assert = require('assert')

parse(`
x,x
a,b
1,2
`.trim(), {
  columns: true,
  from_line: 2
}, function(err, records){
  assert.deepEqual(
    records, [{
      a: '1',
      b: '2'
    }]
  )
})
