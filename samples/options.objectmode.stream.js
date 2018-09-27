
const generate = require('..')
const assert = require('assert')
generate({
  seed: 1,
  objectMode: true,
  columns: 2,
  length: 1
})
.on('readable', function(){
  let record
  while(record = this.read()){
    assert.deepEqual(record, [
      'OMH', 'ONKCHhJmjadoA'
    ])
  }
})
