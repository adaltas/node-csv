csv = require('..');

// To object, using our 'ColumnOne' values as indexes
csv()
.from.path(__dirname + "/to-object.in")
.to.object( function(data){
	console.log(data);
}, {"header":true, "objname": "ColumnOne"});

/*

`node samples/header-based-columns.js`

{ first: { ColumnOne: 'first', ColumnTwo: 'Data' },
  second: { ColumnOne: 'second', ColumnTwo: 'MoreData' } }

*/
