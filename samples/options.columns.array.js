
const parse = require('../lib')
const assert = require('assert')

parse(`
"value 1","value 2"
`.trim(), {
  columns: ['key_1', 'key_2']
}, function(err, records){
  assert.deepEqual(
    records, [{
      key_1: 'value 1',
      key_2: 'value 2'
    }]
  )
})
