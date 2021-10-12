
import assert from 'assert'
import { parse } from 'csv-parse/sync'

const data = 'a key => a value'
const records = parse(data, {
  delimiter: "=>",
  trim: true
})
assert.deepStrictEqual(records, [
  [ "a key", "a value" ]
])
