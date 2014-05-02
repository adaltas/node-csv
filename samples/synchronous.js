
var transform = require('..');

transform([
  ['1','2','3','4'],
  ['a','b','c','d']
], function(data){
  data.push(data.shift());
  return data.join(',')+'\n';
})
.pipe(process.stdout);

// Output:
// 2,3,4,1
// b,c,d,a
