
const generate = require('../lib')
const assert = require('assert')

var data = []
var generator = generate({
  seed: 1,
  objectMode: true,
  columns: 2,
  length: 2
})
generator.on('readable', function(){
  while(d = generator.read()){
    data.push(d)
  }
})
generator.on('error', function(err){
  console.error(err)
})
generator.on('end', function(){
  assert.deepEqual(data, [ [ 'OMH', 'ONKCHhJmjadoA' ],[ 'D', 'GeACHiN' ] ])
})
