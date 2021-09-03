
import assert from 'assert'
import parse from '../lib/index.js'

parse(
  '#Welcome\n"1","2","3","4"\n"a","b","c","d"',
  {comment: '#'},
  function(err, data){
    assert.deepStrictEqual(
      data,
      [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]
    )
  }
);
