
const generate = require('../lib')
const assert = require('assert')

generate({
  seed: 1,
  columns: 2,
  length: 2
}, function(err, output){
  assert.strictEqual(output, 'OMH,ONKCHhJmjadoA\nD,GeACHiN')
})
