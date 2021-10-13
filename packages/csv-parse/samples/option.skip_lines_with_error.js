
import assert from 'assert'
import { parse } from 'csv-parse'

const parser = parse({
  skip_lines_with_error: true
}, function(err, records){
  assert.deepStrictEqual(
    records, [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['h', 'i', 'j']
    ]
  )
})
parser.on( 'skip', function(err){
  assert(/^Invalid Closing Quote/.test(err.message))
})
parser.write(`
"a","b","c"
"d","e","f"
"invalid"," " ","record"
"h","i","j"
`.trim())
parser.end()
