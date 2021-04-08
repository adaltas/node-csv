
const stringify = require('../lib')
const assert = require('assert')

stringify([
  ['1', ''],
  [false, '2'],
  ['3', null],
  [undefined, '4']
], {
  quoted_empty: true
}, function(err, records){
  assert.equal(records, '1,""\n"",2\n3,""\n"",4\n')
})
