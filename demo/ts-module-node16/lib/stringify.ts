
import assert from 'assert'
import { stringify, Stringifier } from 'csv-stringify';

let output: string = '';
// Create the parser
const stringifier: Stringifier = stringify({
  delimiter: ':',
  encoding: 'utf8'
});
// Use the readable stream api to consume records
stringifier.on('readable', function(){
  let record; while ((record = stringifier.read()) !== null) {
    output += record
  }
});
// Catch any error
stringifier.on('error', function(err){
  console.error(err.message)
});
// Test that the parsed records matched what's expected
stringifier.on('end', function(){
  assert.deepStrictEqual(
    output,
    'a:b:c\n1:2:3\n'
  )
});
// Write data to the stream
stringifier.write(["a", "b", "c"]);
stringifier.write([1, 2, 3]);
// Close the readable stream
stringifier.end();
