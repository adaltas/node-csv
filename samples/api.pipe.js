
var stringify = require('../lib');
var generate = require('csv-generate');

generator = generate({objectMode: true, seed: 1, headers: 2});
stringifier = stringify();

generator.pipe(stringifier).pipe(process.stdout);