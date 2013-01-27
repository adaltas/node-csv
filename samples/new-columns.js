
var csv = require('..');

csv()
.from.path(__dirname+'/columns.in',{
  columns: true
})
.to.stream(process.stdout, {
  newColumns: true
})
.transform(function(data){
  data.name = data.firstname + ' ' + data.lastname
  return data;
})
.on('end', function(){
  process.stdout.write('\n');
});

/*

`node samples/new-columns.js`

82,Preisner,Zbigniew,Zbigniew Preisner
94,Gainsbourg,Serge,Serge Gainsbourg

*/
