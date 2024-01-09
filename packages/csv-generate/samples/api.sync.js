
import assert from 'node:assert';
import { generate } from 'csv-generate/sync';

const records = generate({
  seed: 1,
  objectMode: true,
  columns: 2,
  length: 2
});
assert.deepEqual(records, [
  [ 'OMH', 'ONKCHhJmjadoA' ],
  [ 'D', 'GeACHiN' ]
]);
