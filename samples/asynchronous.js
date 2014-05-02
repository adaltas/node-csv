
var transform = require('..');

transform([
  ['1','2','3','4'],
  ['a','b','c','d']
], function(data, callback){
  setImmediate(function(){
    data.push(data.shift());
    callback(null, data.join(',')+'\n');
  });
}, {parallel: 20})
.pipe(process.stdout);

// Output:
// 2,3,4,1
// b,c,d,a
