
import { transform } from 'stream-transform/sync';
import assert from 'node:assert';

const records = transform([
  [ 'a', 'b', 'c', 'd' ],
  [ '1', '2', '3', '4' ]
], function(record){
  record.push(record.shift());
  return record;
});

assert.deepEqual(records, [
  [ 'b', 'c', 'd', 'a' ],
  [ '2', '3', '4', '1' ]
]);
