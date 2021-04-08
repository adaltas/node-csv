
const stringify = require('../lib')
const assert = require('assert')

const data = []
const stringifier = stringify({
  delimiter: ':'
})
stringifier.on('readable', function(){
  let row;
  while(row = stringifier.read()){
    data.push(row)
  }
})
stringifier.on('error', function(err){
  console.error(err.message)
})
stringifier.on('finish', function(){
  assert.equal(
    data.join(''),
    "root:x:0:0:root:/root:/bin/bash\n" +
    "someone:x:1022:1022::/home/someone:/bin/bash\n"
  )
})
stringifier.write([ 'root','x','0','0','root','/root','/bin/bash' ])
stringifier.write([ 'someone','x','1022','1022','','/home/someone','/bin/bash' ])
stringifier.end()
