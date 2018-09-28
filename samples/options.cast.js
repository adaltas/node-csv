
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
    quoting: false, lines: 1, count: 0, index: 1, header: false, column: 1 } ],
  [ '2050-11-27T05:00:00.000Z', {
    quoting: false, lines: 2, count: 1, index: 1, header: false, column: 1 } ]
])
