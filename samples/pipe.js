
should = require('should');
generate = require('../lib');

var generator = generate({seed: 1, headers: 2, length: 2});
generator.pipe(process.stdout);
