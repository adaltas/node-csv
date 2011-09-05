
// CSV sample - Copyright David Worms <open@adaltas.com> (MIT Licensed)

    // node samples/column.js
    var csv = require('csv');
    
    csv()
    .fromPath(__dirname+'/columns.in',{
        columns: true
    })
    .toStream(process.stdout,{
        columns: ['id', 'name']
    })
    .transform(function(data){
        data.name = data.firstname + ' ' + data.lastname
        return data;
    });
    
    // Will print sth like:
    // 82,Zbigniew Preisner
    // 94,Serge Gainsbourg
