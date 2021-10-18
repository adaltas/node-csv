
import { transform } from 'stream-transform';
import assert from 'assert';

const output = [];
// Initialize the transformer
const transformer = transform(function(data){
  data.push(data.shift());
  return data;
});
// Use the readable stream api to consume transformed records
transformer.on('readable', function(){
  let row; while((row = transformer.read()) !== null){
    output.push(row);
  }
});
// Catch any error
transformer.on('error', function(err){
  console.error(err.message);
});
// When finished, validate the records with the expected value
transformer.on('finish', function(){
  assert.deepEqual(output, [
    [ '2', '3', '4', '1' ],
    [ 'b', 'c', 'd', 'a' ]
  ]);
});
// Write records to the stream
transformer.write(['1','2','3','4']);
transformer.write(['a','b','c','d']);
// Close the writable stream
transformer.end();
