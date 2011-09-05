
// CSV sample - Copyright David Worms <open@adaltas.com> (MIT Licensed)

    // node samples/transform.js
    var csv = require('csv');
    
    csv()
    .fromPath(__dirname+'/transform.in')
    .toStream(process.stdout)
    .transform(function(data,index){
        return (index>0 ? ',' : '') + data[0] + ":" + data[2] + ' ' + data[1];
    });
    
    // Print sth like:
    // 82:Zbigniew Preisner,94:Serge Gainsbourg
