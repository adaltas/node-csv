
var csv = require('..');

csv()
.from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
.to(console.log)
.transform(function(data,index){
  return (index>0 ? ',' : '') + data[0] + ":" + data[2] + ' ' + data[1];
});

/*

`node samples/transform.js`

82:Zbigniew Preisner,94:Serge Gainsbourg

*/
