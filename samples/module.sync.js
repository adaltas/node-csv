
// The package "should" must be installed:   
// `npm install should`

const parse = require('../lib/sync')
const assert = require('assert')

const input = `
"key_1","key_2"
"value 1","value 2"
`
const records = parse(input, {
  columns: true,
  skip_empty_lines: true
})
assert.deepEqual(records, [{ key_1: 'value 1', key_2: 'value 2' }])
