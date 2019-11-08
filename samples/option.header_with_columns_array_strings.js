
const stringify = require('../lib')
const assert = require('assert')

stringify( [
  { a: '1', b: '2' }
], {
  header: true,
  columns: [ { key: 'a', header: 'col_a' }, { key: 'b', header: 'col_b' } ]
}, function(err, data){
  assert.equal(data, 'col_a,col_b\n1,2\n')
})
