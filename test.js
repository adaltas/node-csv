
parse = require('./lib/index')

parse("a,b,c\n1,2,3\n4,5,6", function(err, data){
  console.log(data);
})
