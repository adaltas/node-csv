// Alias to the ES6 modules exposing the stream and callback APIs
// Manually managed, not generated

module.exports = {
  generate: require('csv-generate/lib'),
  parse: require('csv-parse/lib'),
  transform: require('stream-transform/lib'),
  stringify: require('csv-stringify/lib')
};
