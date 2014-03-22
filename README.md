[![Build Status](https://secure.travis-ci.org/wdavidw/node-csv-stringify.png)](http://travis-ci.org/wdavidw/node-csv-stringify)

This project is part of the [CSV module](https://github.com/wdavidw/node-csv) 
and a stringifier converting records into a CSV text and implementing the 
Node.js `stream.Transform` API. It is also providing a simple callback-base API 
for converniency. It is both extremely easy to use and powerfull. It was 
released since 2010 and is tested against very large dataset by a large 
community.

[The full documentation of the CSV parser is available here](http://www.adaltas.com/projects/node-csv/).

Note
----

This module is to be considered in alpha stage. It is part of an ongoing effort 
to split the current CSV module into complementary modules with a cleaner design 
and the latest stream implementation. However, the code has been imported with 
very little changes and you should feel confident to use it in your code.

Usage
-----

Run `npm install csv` to install the full csv module or run 
`npm install csv-stringify` if you are only interested by the CSV stringifier.

Use the callback style API for simplicity or the stream based API for 
scalability.

### Using the callback API

The stringifier receive an array and return a string inside a user-provided 
callback. This example is available with the command `node samples/callback.js`.

```javascript
var stringify = require('csv-stringify');

input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];
stringify(input, function(err, output){
  output.should.eql('1,2,3,4\na,b,c,d');
});
```

### Using the stream API
    
```javascript
// node samples/stream.js
var stringify = require('csv-stringify');

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
```

### Using the pipe function

One usefull function part of the Stream API is `pipe` to interact between 
multiple streams. You may use this function to pipe a `stream.Readable` array 
or object source to a `stream.Writable` string destination. The next example 
available as `node samples/pipe.js` generate records, stringify them and print 
them to stdout.

```javascript
stringify = require('csv-stringify');
generate = require('csv-generate');

generator = generate({objectMode: true, seed: 1, headers: 2});
stringifier = stringify();
generator.pipe(stringifier).pipe(process.stdout);
```

Migration
---------

Most of the generator is imported from its parent project [CSV][csv] in a effort 
to split it between the generator, the parser, the transformer and the 
stringifier.

Development
-----------

Tests are executed with mocha. To install it, simple run `npm install` 
followed by `npm test`. It will install mocha and its dependencies in your 
project "node_modules" directory and run the test suite. The tests run 
against the CoffeeScript source files.

To generate the JavaScript files, run `make build`.

The test suite is run online with [Travis][travis] against the versions 
0.9, 0.10 and 0.11 of Node.js.

Contributors
------------

*   David Worms: <https://github.com/wdavidw>

[csv]: https://github.com/wdavidw/node-csv
[travis]: https://travis-ci.org/#!/wdavidw/node-csv-stringify
