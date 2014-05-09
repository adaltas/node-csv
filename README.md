[![Build Status](https://secure.travis-ci.org/wdavidw/node-csv-generate.png)](http://travis-ci.org/wdavidw/node-csv-generate)

CSV and object generation
=========================

This module export a flexible generator of CSV string and Javascript objects 
implementing the Node.js `stream.Readable` API.

Features includes:

*   random or pseudo-random seed based generation
*   `stream.Readable` implementation

Usage
-----

Run `npm install csv` to install the full csv module or run 
`npm install csv-generate` if you are only interested by the CSV parser.

Use the callback style API for simplicity or the stream based API for 
scalability.

### Using the callback API

The parser receive a string and return an array inside a user-provided 
callback. This example is available with the command `node samples/callback.js`.

```javascript
var generate = require('csv-generate');

generate({seed: 1, columns: 2, length: 2}, function(err, output){
  output.should.eql('OMH,ONKCHhJmjadoA\nD,GeACHiN');
});
```

### Using the stream API
    
```javascript
// node samples/stream.js
var generate = require('csv-generate');

var data = []
var generator = generate({seed: 1, objectMode: true, columns: 2, length: 2});
generator.on('readable', function(){
  while(d = generator.read()){
    data.push(d);
  }
});
generator.on('error', function(err){
  console.log(err);
});
generator.on('end', function(){
  data.should.eql([ [ 'OMH', 'ONKCHhJmjadoA' ],[ 'D', 'GeACHiN' ] ]);
});
```

### Using the pipe function

One usefull function part of the Stream API is `pipe` to interact between 
multiple streams. You may use this function to pipe a `stream.Readable` string 
source to a `stream.Writable` object destination. The next example available as 
`node samples/pipe.js` read the file, parse its content and transform it.

```javascript
// node samples/pipe.js
var generate = require('csv-generate');

var generator = generate({columns: ['int', 'bool'], length: 2});
generator.pipe(process.stdout);
```

Migration
---------

Most of the generator is imported from its parent project [CSV][csv] in a effort 
to split it between the generator, the parser, the transformer and the stringifier.

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
[travis]: https://travis-ci.org/#!/wdavidw/node-csv-generate
