
import assert from 'assert'
import parse from '../lib/index.js'

const data = `a,"b""c",d`
const records = parse(data)
assert.deepStrictEqual(records, [
  [ 'a', 'b"c', 'd' ]
])
