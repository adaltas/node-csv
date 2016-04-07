
// The package "should" must be installed:   
// `npm install should`

fs = require('fs');
parse = require('..');

// Using the first line of the CSV data to discover the column names
rs = fs.createReadStream(__dirname+'/wrong-rowDelimiter.in');
parser = parse({rowDelimiter: '::'}, function(err, data){
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
})
rs.pipe(parser);

/*

`node samples/header-based-columns.js`

[ { Foo: 'first', Bar: 'row', Baz: 'items' },
  { Foo: 'second', Bar: 'row', Baz: 'items' } ]

*/