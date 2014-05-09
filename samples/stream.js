
var parse = require('../lib');
require('should');

var output = [];
var parser = parse({delimiter: ':'})
parser.on('readable', function(){
  while(record = parser.read()){
    output.push(record);
  }
});
parser.on('error', function(err){
  consol.log(err.message);
});
parser.on('finish', function(){
  output.should.eql([
    [ 'root','x','0','0','root','/root','/bin/bash' ],
    [ 'someone','x','1022','1022','a funny cat','/home/someone','/bin/bash' ]
  ]);
});
parser.write("root:x:0:0:root:/root:/bin/bash\n");
parser.write("someone:x:1022:1022:a funny cat:/home/someone:/bin/bash\n");
parser.end();

