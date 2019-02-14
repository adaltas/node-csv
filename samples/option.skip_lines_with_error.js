const parse = require('..')
const assert = require('assert')

parser = parse({
  skip_lines_with_error: true
}, function(err, records){
  assert.deepEqual(
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
