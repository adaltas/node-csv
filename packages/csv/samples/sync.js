
import assert from 'node:assert';
import {generate, parse, transform, stringify} from 'csv/sync';

// Run the pipeline
const input = generate({seed: 1, columns: 2, length: 5});
const rawRecords = parse(input);
const refinedRecords = transform(rawRecords, function(data){
  return data.map(function(value){return value.toUpperCase();});
});
const output = stringify(refinedRecords);
// Print the final result
assert.equal(output, 
  `OMH,ONKCHHJMJADOA
D,GEACHIN
NNMIN,CGFDKB
NIL,JNNMJADNMINL
KB,DMIM
`);
