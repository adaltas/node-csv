
import { stringify } from 'csv-stringify'
import assert from 'assert'

stringify([
  ['1', '2'],
  ['3', '4']
], {
  delimiter: ':)'
}, function(err, records){
  assert.equal(records, '1:)2\n3:)4\n')
})
