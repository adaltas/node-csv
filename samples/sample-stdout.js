var csv = require('..');

var data = [
  [1,2,3,4,5],
  [2,4,6,8,10]
];

csv()
.from.array(data)
.to.stream(process.stdout, {end: false});  //thows on csv.js line 150

/*

`node samples/sample-stdout.js`

1,2,3,4,5
2,4,6,8,10

*/
