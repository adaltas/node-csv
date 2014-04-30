csv = require('..');

// To array, using the header row as column names
csv()
.from.path(__dirname + "/header-based-columns.in", {"columns": true})
.to.array( function(data){
	console.log(data);
});

/*

`node samples/header-based-columns.js`

[ { Foo: 'first', Bar: 'row', Baz: 'items' },
  { Foo: 'second', Bar: 'row', Baz: 'items' } ]

*/
