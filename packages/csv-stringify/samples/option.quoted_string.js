
import stringify from '../lib/index.js'
import assert from 'assert'

stringify([
  ['1', '', true, 2],
], {
  quoted_string: true
}, function(err, records){
  assert.equal(records, '"1","",1,2\n')
})
