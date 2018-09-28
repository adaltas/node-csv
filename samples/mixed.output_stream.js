
const parse = require('..')
const assert = require('assert')

const output = []
parse(`
  "1","2","3"
  "a","b","c"
`, {
  trim: true,
  skip_empty_lines: true
})
// Use the readable stream api
.on('readable', function(){
  let record
  while (record = this.read()) {
    output.push(record)
  }
})
// When we are done, test that the parsed output matched what expected
.on('end', function(){
  assert.deepEqual(
    output,
    [
      [ '1','2','3' ],
      [ 'a','b','c' ]
    ]
  )
})
