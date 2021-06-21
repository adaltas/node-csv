const parse = require('../lib/sync')
const assert = require('assert')

const data = `a,"b""c",d`
const records = parse(data)
assert.deepStrictEqual(records, [
  [ 'a', 'b"c', 'd' ]
])
