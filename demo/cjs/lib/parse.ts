
import assert from 'assert'
import { parse, Parser } from 'csv-parse'

const output: any = [];
// Create the parser
const parser: Parser = parse({
  delimiter: ':'
});
// Use the readable stream api to consume records
parser.on('readable', function(){
  let record; while ((record = parser.read()) !== null) {
    output.push(record)
  }
});
// Catch any error
parser.on('error', function(err){
  console.error(err.message)
});
// Test that the parsed records matched what's expected
parser.on('end', function(){
  assert.deepStrictEqual(
    output,
    [
      [ 'a','b','c' ],
      [ '1','2','3' ]
    ]
  )
});
// Write data to the stream
parser.write("a:b:c\n");
parser.write("1:2:3\n");
// Close the readable stream
parser.end();
