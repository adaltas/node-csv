
import transform from '../lib/index.js'
import assert from assert

const output = []
const transformer = transform(function(data){
  data.push(data.shift())
  return data
})
transformer.on('readable', function(){
  while(row = transformer.read()){
    output.push(row)
  }
})
transformer.on('error', function(err){
  console.error(err.message)
})
transformer.on('finish', function(){
  assert.deepEqual(output, [
    [ '2', '3', '4', '1' ],
    [ 'b', 'c', 'd', 'a' ]
  ])
})
transformer.write(['1','2','3','4'])
transformer.write(['a','b','c','d'])
transformer.end()
