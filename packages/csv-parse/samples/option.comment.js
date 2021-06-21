
const parse = require('../lib/sync')
const assert = require('assert')

const data = `
# At the beginning of a record
"hello"
"world"# At the end of a record
`.trim()
const records = parse(data, {
  comment: "#"
})
assert.deepStrictEqual(records, [
  [ "hello" ],
  [ "world" ]
])
