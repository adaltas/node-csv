
import assert from 'node:assert';
import { parse } from 'csv-parse';

parse(
  '#Welcome\n"1","2","3","4"\n"a","b","c","d"',
  {comment: '#'},
  function(err, data){
    assert.deepStrictEqual(
      data,
      [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]
    );
  }
);
