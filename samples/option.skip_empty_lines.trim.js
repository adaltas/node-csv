const parse = require('../lib/sync')
const assert = require('assert')

const records = parse(`
"a","b","c"
\t
"d","e","f"
`, {
  skip_empty_lines: true,
  trim: true
})

assert.deepEqual(
  records, [
    ['a', 'b', 'c'],
    ['d', 'e', 'f']
  ]
)
