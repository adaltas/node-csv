
// Output looks like:
// foo,1969-12-31T23:00:00.000Z
// bar,1970-12-31T23:00:00.000Z

const stringify = require('../lib')
const input = [{
  name: 'foo',
  date: new Date(1970, 0)
}, {
  name: 'bar',
  date: new Date(1971, 0)
}]
var stringifier = stringify(input, {
  formatters: {
    date: function(value) {
      return value.toISOString()
    }
  }
}, function(err, output) {
  console.info(output)
})
