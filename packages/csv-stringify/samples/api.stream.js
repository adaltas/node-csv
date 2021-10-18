
import { stringify } from 'csv-stringify';
import assert from 'assert';

const data = [];
// Initialize the stringifier
const stringifier = stringify({
  delimiter: ':'
});
// Use the readable stream api to consume CSV data
stringifier.on('readable', function(){
  let row;
  while((row = stringifier.read()) !== null){
    data.push(row);
  }
});
// Catch any error
stringifier.on('error', function(err){
  console.error(err.message);
});
// When finished, validate the CSV output with the expected value
stringifier.on('finish', function(){
  assert.equal(
    data.join(''),
    "root:x:0:0:root:/root:/bin/bash\n" +
    "someone:x:1022:1022::/home/someone:/bin/bash\n"
  );
});
// Write records to the stream
stringifier.write([ 'root','x','0','0','root','/root','/bin/bash' ]);
stringifier.write([ 'someone','x','1022','1022','','/home/someone','/bin/bash' ]);
// Close the writable stream
stringifier.end();
