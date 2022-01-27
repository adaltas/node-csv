const { stringify } = require('csv-stringify/sync');

const output = stringify([['a', 'b', 'c']]);

console.log(output);
