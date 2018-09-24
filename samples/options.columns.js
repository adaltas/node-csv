
const parse = require('../lib')
const assert = require('assert')

const records = parse(`
  "key_1","key_2"
  "value 1","value 2"
`, {
  columns: true,
  trim: true,
  skip_empty_lines: true
}, function(err, records){
  assert.deepEqual(
    records, [{
      key_1: 'value 1',
      key_2: 'value 2'
    }]
  )
})
