const parse = require('../lib/sync')
const assert = require('assert')

const records = parse(`
"a","b","c"

"d","e","f"
`, {
  skip_empty_lines: true
})

assert.deepEqual(
  records, [
    ['a', 'b', 'c'],
    ['d', 'e', 'f']
  ]
)
