
// Output looks like:
// birthYear,phone
// OMH,ONKCHhJmjadoA

var stringify = require('../lib');
var generate = require('csv-generate');

var generator = generate({objectMode: true, seed: 1, headers: 2});

var columns = {
 year: 'birthYear',
 phone: 'phone'
};
var stringifier = stringify({ header: true, columns: columns });

generator.pipe(stringifier).pipe(process.stdout);
