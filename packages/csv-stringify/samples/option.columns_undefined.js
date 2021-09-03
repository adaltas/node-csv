
import stringify from '../lib/index.js'
import assert from 'assert'

stringify([
  { year: 'XXXX', phone: 'XXX XXXX', nocolumn: 'XXX' },
  { year: 'YYYY', phone: 'YYY YYYY', nocolumn: 'XXX' }
],{
  columns: ['phone', 'year', 'nofield']
}, function(err, data){
  assert.equal(
    data,
    "XXX XXXX,XXXX,\n" +
    "YYY YYYY,YYYY,\n"
  )
})
