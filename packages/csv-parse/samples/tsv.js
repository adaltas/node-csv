
import assert from 'assert'
import { parse } from 'csv-parse'

parse( "1	2	3\ra	b	c", {delimiter: '\t'}, function(err, data){
  if(err) throw err;
  assert.deepStrictEqual(data, [ [ '1', '2', '3' ], [ 'a', 'b', 'c' ] ]);
});
