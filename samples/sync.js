
// The package "should" must be installed:   
// `npm install should`

var parse = require('../lib/sync');
require('should');

var input = '"key_1","key_2"\n"value 1","value 2"';
var records = parse(input, {columns: true});
records.should.eql([{ key_1: 'value 1', key_2: 'value 2' }]);
