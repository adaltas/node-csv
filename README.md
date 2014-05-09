[![Build Status](https://secure.travis-ci.org/wdavidw/node-csv-parse.png)](http://travis-ci.org/wdavidw/node-csv-parse)

Part of the [CSV module](https://github.com/wdavidw/node-csv), this project is a
parser converting CSV text input into arrays or objects. It implements the 
Node.js `stream.Transform` API. It also provides a simple callback-base API for
convenience. It is both extremely easy to use and powerful. It was first 
released in 2010 and is used against big data sets by a large community.

[The full documentation of the CSV parser is available here](http://www.adaltas.com/projects/node-csv/).

## Note

This module is to be considered in beta stage. It is part of an ongoing effort 
to split the current CSV module into complementary modules with a cleaner design 
and the latest stream implementation. However, the code has been imported with 
very little changes and you should feel confident to use it in your code.

## Usage

Run `npm install csv` to install the full CSV module or run 
`npm install csv-parse` if you are only interested by the CSV parser.

Use the callback style API for simplicity or the stream based API for 
scalability.

For examples, refer to [the "samples" folder][csv-samples], 
the documentation or [the "test" folder][csv-test].

### Using the callback API

The parser receive a string and return an array inside a user-provided 
callback. This example is available with the command `node samples/callback.js`.

```javascript
var parse = require('csv-parse');
require('should');

var input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';
parse(input, {comment: '#'}, function(err, output){
  output.should.eql([ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]);
});
```

### Using the stream API

CSV data is send through the `write` function and the resulted data is obtained
within the "readable" event by calling the `read` function. This example is 
available with the command `node samples/stream.js`.
    
```javascript
var parse = require('csv-parse');
require('should');

var output = [];
var parser = parse({delimiter: ':'})
parser.on('readable', function(){
  while(record = parser.read()){
    output.push(record);
  }
});
parser.on('error', function(err){
  console.log(err.message);
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
```

### Using the pipe function

One useful function part of the Stream API is `pipe` to interact between 
multiple streams. You may use this function to pipe a `stream.Readable` string 
source to a `stream.Writable` object destination. This example available as 
`node samples/pipe.js` read the file, parse its content and transform it.

```javascript
var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');

var output = [];
var parser = parse({delimiter: ':'})
var input = fs.createReadStream('/etc/passwd');
var transformer = transform(function(record, callback){
  setTimeout(function(){
    callback(null, record.join(' ')+'\n');
  }, 500);
}, {parallel: 10});
input.pipe(parser).pipe(transformer).pipe(process.stdout);
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
0.10 and 0.11 of Node.js.

Contributors
------------

*   David Worms: <https://github.com/wdavidw>
*   Will White: <https://github.com/willwhite>
*   Justin Latimer: <https://github.com/justinlatimer>
*   jonseymour: <https://github.com/jonseymour>
*   pascalopitz: <https://github.com/pascalopitz>
*   Josh Pschorr: <https://github.com/jpschorr>
*   Elad Ben-Israel: <https://github.com/eladb>
*   Philippe Plantier: <https://github.com/phipla>
*   Tim Oxley: <https://github.com/timoxley>
*   Damon Oehlman: <https://github.com/DamonOehlman>
*   Alexandru Topliceanu: <https://github.com/topliceanu>
*   Visup: <https://github.com/visup>
*   Edmund von der Burg: <https://github.com/evdb>
*   Douglas Christopher Wilson: <https://github.com/dougwilson>
*   Chris Khoo: <https://github.com/khoomeister>
*   Joeasaurus: <https://github.com/Joeasaurus>

Related projects
----------------

*   Pavel Kolesnikov "ya-csv": <http://github.com/koles/ya-csv>
*   Chris Williams "node-csv": <http://github.com/voodootikigod/node-csv>

[csv]: https://github.com/wdavidw/node-csv
[csv-samples]: https://github.com/wdavidw/node-csv-parse/tree/master/samples
[csv-test]: https://github.com/wdavidw/node-csv-parse/tree/master/test
[travis]: https://travis-ci.org/#!/wdavidw/node-csv-parse

