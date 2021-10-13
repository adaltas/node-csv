
import assert from 'assert'
import { parse } from 'csv-parse/sync'

const data = `
  2000-01-01,date1
  2050-11-27,date2
`.trim()
const records = parse(data, {
  // The cast option exect a function which 
  // is called with two arguments,
  // the parsed value and a context object
  cast: function(value, context){
    // You can return any value
    if(context.index === 0){
      // Such as a string
      return `${value}T05:00:00.000Z`
    }else{
      // Or the `context` object literal
      return context
    }
  },
  trim: true
})
assert.deepStrictEqual(records, [
  [ '2000-01-01T05:00:00.000Z', {
    bytes: 16, comment_lines: 0, empty_lines: 0, invalid_field_length: 0,
    lines: 1, records: 0, columns: false, error: undefined, header: false,
    index: 1, column: 1, quoting: false
  } ],
  [ '2050-11-27T05:00:00.000Z', {
    bytes: 35, comment_lines: 0, empty_lines: 0, invalid_field_length: 0,
    lines: 2, records: 1, columns: false, error: undefined, header: false,
    index: 1, column: 1, quoting: false
  } ]
])
