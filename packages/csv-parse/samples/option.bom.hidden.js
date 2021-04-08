
const parse = require('../lib/sync')
const assert = require('assert')

const data = "\ufeffkey\nvalue"
const records = parse(data, {
  bom: false,
  columns: true
})
// It seems that the output is perfectly fine
assert.equal(JSON.stringify(records[0]), '{"﻿key":"value"}')
// However, the first property include the BOM bytes
assert.equal(Object.keys(records[0])[0], '\ufeffkey')
