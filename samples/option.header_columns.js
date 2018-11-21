
const stringify = require('../lib')
const assert = require('assert')

stringify([
  { year: 'XXXX', phone: 'XXX XXXX', nocolumn: 'XXX' },
  { year: 'YYYY', phone: 'YYY YYYY', nocolumn: 'XXX' }
],{
  header: true,
  columns: ['phone', 'year', 'nofield']
}, function(err, data){
  assert.equal(
    data,
    "phone,year,nofield\n" +
    "XXX XXXX,XXXX,\n" +
    "YYY YYYY,YYYY,\n"
  )
})
