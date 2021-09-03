
import generate from '../lib/index.js'
import assert from 'assert'

const records = generate({
  seed: 1,
  objectMode: true,
  columns: 2,
  length: 2
})
assert.deepEqual(records, [
  [ 'OMH', 'ONKCHhJmjadoA' ],
  [ 'D', 'GeACHiN' ]
])
