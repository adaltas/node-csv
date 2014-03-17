
require('should');
var stringify = require('../lib');

data = '';
stringifier = stringify({delimiter: ':'})
stringifier.on('readable', function(){
  while(row = stringifier.read()){
    data += row;
  }
});
stringifier.on('error', function(err){
  consol.log(err.message);
});
stringifier.on('finish', function(){
  data.should.eql(
    "root:x:0:0:root:/root:/bin/bash\n" +
    "someone:x:1022:1022:a funny cat:/home/someone:/bin/bash"
  );
});
stringifier.write([ 'root','x','0','0','root','/root','/bin/bash' ]);
stringifier.write([ 'someone','x','1022','1022','a funny cat','/home/someone','/bin/bash' ]);
stringifier.end();