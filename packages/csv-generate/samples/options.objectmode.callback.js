
import generate from '../lib/index.js'
import assert from 'assert'

generate({
  seed: 1,
  objectMode: true,
  columns: 2,
  length: 2
}, function(err, records){
  assert.deepEqual(records, [
    [ 'OMH', 'ONKCHhJmjadoA' ],
    [ 'D', 'GeACHiN' ]
  ])
})
