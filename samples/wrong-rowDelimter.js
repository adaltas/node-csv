
// The package "should" must be installed:   
// `npm install should`

fs = require('fs');
parse = require('..');

// When rowDelimiter does not match the parsed data's rowDelimiter. Data parsed will be limited to max_limit_on_data_read option set.
// If the max_limit_on_data_read value is not set, default value is set to 250K of data.
rs = fs.createReadStream(__dirname+'/sampleData.in');
parser = parse({rowDelimiter: '::', max_limit_on_data_read: 100}, function(err, data){
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