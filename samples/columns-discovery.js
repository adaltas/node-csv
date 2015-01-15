
// The package "should" must be installed:   
// `npm install should`

fs = require('fs');
parse = require('..');

// Using the first line of the CSV data to discover the column names
rs = fs.createReadStream(__dirname+'/columns-discovery.in');
parser = parse({columns: true}, function(err, data){
  console.log(data);
})
rs.pipe(parser);

/*

`node samples/header-based-columns.js`

[ { Foo: 'first', Bar: 'row', Baz: 'items' },
  { Foo: 'second', Bar: 'row', Baz: 'items' } ]

*/