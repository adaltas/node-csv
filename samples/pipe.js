
should = require('should');
generate = require('../lib');

var generator = generate({columns: ['int', 'bool'], length: 2});
generator.pipe(process.stdout);
