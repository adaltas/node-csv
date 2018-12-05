
const stringify = require('../lib')
const assert = require('assert')

stringify([{
  name: 'foo',
  date: new Date(1970, 0)
},{
  name: 'bar',
  date: new Date(1971, 0)
}],{
  cast: {
    date: function(value) {
      return value.toISOString()
    }
  }
}, function(err, data) {
  assert.equal(
    data,
    "foo,1969-12-31T23:00:00.000Z\n" +
    "bar,1970-12-31T23:00:00.000Z\n"
  )
})
