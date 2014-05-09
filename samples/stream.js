
require('should');
var parse = require('../lib');

output = [];

// Create a parser as a writable stream
// Each parsed row is pushed on the output array
parser = parse({delimiter: ':'})
parser.on('readable', function(){
  while(row = parser.read()){
    output.push(row)
  }
});
parser.on('error', function(err){
  consol.log(err.message);
});


// When we are done, test that the parsed output matched what expected
parser.on('finish', function(){
  output.should.eql([
    [ 'root','x','0','0','root','/root','/bin/bash' ],
    [ 'someone','x','1022','1022','a funny cat','/home/someone','/bin/bash' ]
  ]);
});

// Now that setup is done, write some data to the stream
parser.write("root:x:0:0:root:/root:/bin/bash\n");
parser.write("someone:x:1022:1022:a funny cat:/home/someone:/bin/bash\n");
parser.end()

