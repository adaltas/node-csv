
const parse = require('../lib/sync')
const assert = require('assert')

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
    column: 1, empty_lines: 0, header: false, index: 1, error: undefined,
    invalid_field_length: 0, quoting: false, lines: 1, records: 0
  } ],
  [ '2050-11-27T05:00:00.000Z', {
    column: 1, empty_lines: 0, header: false, index: 1, error: undefined,
    invalid_field_length: 0, quoting: false, lines: 2, records: 1
  } ]
])
