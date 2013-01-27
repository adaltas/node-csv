
var csv = require('..');

csv()
.from.path(__dirname+'/sample.in')
.to.path(__dirname+'/sample.out')
.transform(function(data){
  data.unshift(data.pop());
  return data;
})
.on('record', function(data, index){
  console.log('#'+index+' '+JSON.stringify(data));
})
.on('end', function(count){
  console.log('Number of lines: '+count);
})
.on('error', function(error){
  console.log(error.message);
});

/*

`node samples/sample.js`

#0 ["2000-01-01","20322051544","1979.0","8.8017226E7","ABC","45"]
#1 ["2050-11-27","28392898392","1974.0","8.8392926E7","DEF","23"]
Number of lines: 2

*/
