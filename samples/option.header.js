
// Output looks like:
// birthYear,phone
// OMH,ONKCHhJmjadoA

const stringify = require('../lib')
const assert = require('assert')

stringify([
  { year: 'XXXX', phone: 'XXX XXXX' },
  { year: 'YYYY', phone: 'YYY YYYY' }
],{
  header: true
}, function(err, data){
  assert.equal(
    data,
    "year,phone\n" +
    "XXXX,XXX XXXX\n" +
    "YYYY,YYY YYYY\n"
  )
})
