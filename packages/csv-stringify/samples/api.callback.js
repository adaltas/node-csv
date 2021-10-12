
import { stringify } from 'csv-stringify'
import assert from 'assert'

stringify([
  [ '1', '2', '3', '4' ],
  [ 'a', 'b', 'c', 'd' ]
], function(err, output){
  assert.equal(output, '1,2,3,4\na,b,c,d\n')
})
