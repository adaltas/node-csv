
const parse = require('..')
const assert = require('assert')

parse(`
line 1
line 2
line 3
`.trim(), {
  on_record: (record, {lines}) =>
    lines === 2 ? null : record
}, function(err, records){
  assert.deepStrictEqual(
    records, [
      [`line 1`],
      [`line 3`]
    ]
  )
})
