
const generate = require('../lib')
const assert = require('assert')
const records = []
generate({
  seed: 1,
  objectMode: true,
  columns: 2,
  length: 2
})
.on('readable', function(){
  let record
  while(record = this.read()){
    records.push(record)
  }
})
.on('error', function(err){
  console.error(err)
})
.on('end', function(){
  assert.deepEqual(records, [
    [ 'OMH', 'ONKCHhJmjadoA' ],
    [ 'D', 'GeACHiN' ]
  ])
})
