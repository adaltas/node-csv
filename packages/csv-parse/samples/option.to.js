
import assert from 'assert';
import { parse } from 'csv-parse';

parse(`
a,b
1,2
3,4
5,6
`.trim(), {
  columns: true,
  to: 2
}, function(err, records){
  console.log(err, records)
  assert.deepStrictEqual(
    records, [{
      a: '1',
      b: '2'
    }, {
      a: '3',
      b: '4'
    }]
  );
});
