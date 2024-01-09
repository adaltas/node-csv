
import { transform } from 'stream-transform';
import assert from 'node:assert';

// Generate a dataset of 5 records
const records = 'record\n'.repeat(5).trim().split('\n');
const assertions = [
  '2_2_0',
  '1_2_1',
  '2_4_2',
  '1_4_3',
  '1_5_4',
];
let count = 0;
// Execute the transformation
transform(records, {parallel: 2}, function(_, callback){
  setTimeout(() => {
    const {running, started, finished} = this.state;
    assert.equal(assertions[count++], `${running}_${started}_${finished}`);
    callback(null, `${running}_${started}_${finished}\n`);
  }, 100);
})
  // Get notify on error
  .on('end', function(){
    const {running, started, finished} = this.state;
    process.stdout.write(`end: ${running}_${started}_${finished}\n`);
  })
  // Print the transformed records to the standard output
  .pipe(process.stdout);
