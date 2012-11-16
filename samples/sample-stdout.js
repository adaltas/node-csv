
var csv = require('..');

var data = [
  [1,2,3,4,5],
  [2,4,6,8,10]
];

// Note, in the latest version of Node.js, the pipe 
// method detect `process.stdout` and wont try to close it.

csv()
.from.array(data)
.to.stream(process.stdout, {end: false});

/*

`node samples/sample-stdout.js`

1,2,3,4,5
2,4,6,8,10

*/
