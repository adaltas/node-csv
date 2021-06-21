
const parse = require('../lib/sync')
const assert = require('assert')

const data = "a,b,c"
const records = parse(data, {
  info: true
})
assert.deepStrictEqual(records, [{
  info: {
    comment_lines: 0,
    empty_lines: 0,
    invalid_field_length: 0,
    lines: 1,
    records: 0
  },
  record: [ 'a', 'b', 'c' ]
}])
