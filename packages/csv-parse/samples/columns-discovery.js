
import fs from 'fs'
import parse from '../lib/index.js'

import { dirname } from 'path'
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url))

// Using the first line of the CSV data to discover the column names
const rs = fs.createReadStream(__dirname+'/columns-discovery.in');
const parser = parse({columns: true}, function(err, data){
  console.log(data);
})
rs.pipe(parser);

/*

`node samples/header-based-columns.js`

[ { Foo: 'first', Bar: 'row', Baz: 'items' },
  { Foo: 'second', Bar: 'row', Baz: 'items' } ]

*/
