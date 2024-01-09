
import assert from 'node:assert';
import { generate } from 'csv-generate';

generate({
  seed: 1,
  objectMode: true,
  columns: 2,
  length: 1
})
  .on('readable', function(){
    let record; while((record = this.read()) !== null){
      assert.deepEqual(record, [
        'OMH', 'ONKCHhJmjadoA'
      ]);
    }
  });
