
import assert from 'assert'
import parse from '../lib/index.js'

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
  assert.deepStrictEqual(
    output,
    [
      [ '1','2','3' ],
      [ 'a','b','c' ]
    ]
  )
})
