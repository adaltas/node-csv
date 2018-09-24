
const stringify = require('../lib')
const assert = require('assert')

input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]
stringify(input, function(err, output){
  assert.equal(output, '1,2,3,4\na,b,c,d\n')
})
