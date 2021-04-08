const parse = require('../lib/sync')
const assert = require('assert')

const records = parse( '1,2\nin:va:lid\n3,4', {
  columns: ['a', 'b'],
  relax_column_count: true,
  raw: true,
  on_record: ({raw, record}, {error}) => {
    if(error && error.code === 'CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH'){
      return raw.trim().split(':')
    } else {
      return record
    }
  }
})
assert.deepStrictEqual(
  records, [
    { a: '1', b: '2' },
    [ 'in', 'va', 'lid' ],
    { a: '3', b: '4' }
  ]
)
