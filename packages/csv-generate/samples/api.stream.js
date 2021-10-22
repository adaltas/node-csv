
import { generate } from 'csv-generate';
import assert from 'assert';

const records = [];
// Initialize the generator
generate({
  seed: 1,
  objectMode: true,
  columns: 2,
  length: 2
})
// Use the readable stream api to consume generated records
  .on('readable', function(){
    let record; while((record = this.read()) !== null){
      records.push(record);
    }
  })
// Catch any error
  .on('error', function(err){
    console.error(err);
  })
// Test that the generated records matched the expected records
  .on('end', function(){
    assert.deepEqual(records, [
      [ 'OMH', 'ONKCHhJmjadoA' ],
      [ 'D', 'GeACHiN' ]
    ]);
  });
