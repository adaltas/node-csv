var csv = require('..');

var arr = [
  [1,2,3,4,5],
  [2,4,6,8,10]
];

csv()
  .from(arr)
  .toStream(process.stdout, {end: false});  //thows on csv.js line 150