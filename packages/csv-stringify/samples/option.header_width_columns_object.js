
import { stringify } from 'csv-stringify';
import assert from 'assert';

stringify([
  { a: '1', b: '2' }
], {
  header: true,
  columns: { 'a': 'col_a', 'b': 'col_b' }
}, function(err, data){
  assert.equal(data, 'col_a,col_b\n1,2\n');
});
