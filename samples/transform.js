
// CSV sample - Copyright David Worms <open@adaltas.com> (BSD Licensed)

// node samples/transform.js
var csv = require('..');

csv()
.fromPath(__dirname+'/transform.in')
.toStream(process.stdout)
.transform(function(data,index){
    return (index>0 ? ',' : '') + data[0] + ":" + data[2] + ' ' + data[1];
});

/*

`node samples/transform.js`

82:Zbigniew Preisner,94:Serge Gainsbourg

*/
