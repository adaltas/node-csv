
import assert from 'assert'
import { parse } from 'csv-parse/sync'

const data = `a,"b\\"c",d`
const records = parse(data, { escape: '\\' })
assert.deepStrictEqual(records, [
  [ 'a', 'b"c', 'd' ]
])
