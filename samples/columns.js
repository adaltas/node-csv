
// CSV sample - Copyright David Worms <open@adaltas.com> (BSD Licensed)

// node samples/column.js
var csv = require('..');

csv()
.from.path(__dirname+'/columns.in', {
    columns: true
})
.to.stream(process.stdout, {
    columns: ['id', 'name'],
    end: false
})
.transform(function(data){
    data.name = data.firstname + ' ' + data.lastname
    return data;
});

/*

`node samples/columns.js`

82,Zbigniew Preisner
94,Serge Gainsbourg

*/
