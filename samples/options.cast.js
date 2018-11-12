
const parse = require('../lib/sync')
const assert = require('assert')

const data = `
  2000-01-01,date1
  2050-11-27,date2
`.trim()
const records = parse(data, {
  cast: function(value, context){
    if(context.index === 0){
      return `${value}T05:00:00.000Z`
    }else{
      return context
    }
  },
  trim: true
})
assert.deepEqual(records, [
  [ '2000-01-01T05:00:00.000Z', {
    column: 1, empty_lines: 0, header: false, index: 1,
    quoting: false, lines: 1, records: 0, skipped_line_count: 0
  } ],
  [ '2050-11-27T05:00:00.000Z', {
    column: 1, empty_lines: 0, header: false, index: 1,
    quoting: false, lines: 2, records: 1, skipped_line_count: 0
  } ]
])
