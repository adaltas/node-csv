
import assert from 'assert'
import parse from '../lib/index.js'

const records = parse(`
"a","b","c"

"d","e","f"
`, {
  skip_empty_lines: true
})

assert.deepStrictEqual(
  records, [
    ['a', 'b', 'c'],
    ['d', 'e', 'f']
  ]
)
